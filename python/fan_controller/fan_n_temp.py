import RPi.GPIO as GPIO 
from time import sleep
import signal, sys, threading
import smbus, time
import pigpio # http://abyz.co.uk/rpi/pigpio/python.html


class reader:
# Authur: unknown
# read_RPM.py
# 2016-01-20
# Public Domain
   """
   A class to read speedometer pulses and calculate the RPM.
   """
   def __init__(self, pi, gpio, pulses_per_rev=1.0, weighting=0.0, min_RPM=5.0):
      """
      Instantiate with the Pi and gpio of the RPM signal
      to monitor.

      Optionally the number of pulses for a complete revolution
      may be specified.  It defaults to 1.

      Optionally a weighting may be specified.  This is a number
      between 0 and 1 and indicates how much the old reading
      affects the new reading.  It defaults to 0 which means
      the old reading has no effect.  This may be used to
      smooth the data.

      Optionally the minimum RPM may be specified.  This is a
      number between 1 and 1000.  It defaults to 5.  An RPM
      less than the minimum RPM returns 0.0.
      """
      self.pi = pi
      self.gpio = gpio
      self.pulses_per_rev = pulses_per_rev

      if min_RPM > 1000.0:
         min_RPM = 1000.0
      elif min_RPM < 1.0:
         min_RPM = 1.0

      self.min_RPM = min_RPM

      self._watchdog = 200 # Milliseconds.

      if weighting < 0.0:
         weighting = 0.0
      elif weighting > 0.99:
         weighting = 0.99

      self._new = 1.0 - weighting # Weighting for new reading.
      self._old = weighting       # Weighting for old reading.

      self._high_tick = None
      self._period = None

      pi.set_mode(gpio, pigpio.INPUT)

      self._cb = pi.callback(gpio, pigpio.RISING_EDGE, self._cbf)
      pi.set_watchdog(gpio, self._watchdog)

   def _cbf(self, gpio, level, tick):

      if level == 1: # Rising edge.

         if self._high_tick is not None:
            t = pigpio.tickDiff(self._high_tick, tick)

            if self._period is not None:
               self._period = (self._old * self._period) + (self._new * t)
            else:
               self._period = t

         self._high_tick = tick

      elif level == 2: # Watchdog timeout.

         if self._period is not None:
            if self._period < 2000000000:
               self._period += (self._watchdog * 1000)

   def RPM(self):
      """
      Returns the RPM.
      """
      RPM = 0.0
      if self._period is not None:
         RPM = 60000000.0 / (self._period * self.pulses_per_rev)
         if RPM < self.min_RPM:
            RPM = 0.0

      return RPM

   def cancel(self):
      """
      Cancels the reader and releases resources.
      """
      self.pi.set_watchdog(self.gpio, 0) # cancel watchdog
      self._cb.cancel()

class AHT10:
# Authur: unknown
# AHT10.py
# Public Domain

    CONFIG = [0x08, 0x00]
    MEASURE = [0x33, 0x00]

    # init - class constructor
    # bus - your I2C bus. You can watch it with "ls /dev | grep i2c-" command. If no output, enable I2C in raspi-config
    # addr - AHT10 I2C address. Can be switched by change resistor position on the bottom of your board. Default is 0x38
    #     You can set in to 0x39
    def __init__(self, bus, addr=0x38):
        self.bus = smbus.SMBus(bus)
        self.addr = addr
        self.bus.write_i2c_block_data(self.addr, 0xE1, self.CONFIG)
        time.sleep(0.2) #Wait for AHT to do config (0.2ms from datasheet)

    # getData - gets temperature and humidity
    # returns tuple of collected data. getData[0] is Temp, getData[1] is humidity
    def getData(self):
        byte = self.bus.read_byte(self.addr)
        self.bus.write_i2c_block_data(self.addr, 0xAC, self.MEASURE)
        time.sleep(0.5)
        data = self.bus.read_i2c_block_data(self.addr, 0x00)
        temp = ((data[3] & 0x0F) << 16) | (data[4] << 8) | data[5]
        ctemp = ((temp*200) / 1048576) - 50
        hum = ((data[1] << 16) | (data[2] << 8) | data[3]) >> 4
        chum = int(hum * 100 / 1048576)
        return (ctemp, chum)



# Authur: Nick Leavitt
# fan_n_temp.py
# 07/02/2023
# Public Domain

def calc_fan_sp(c_tmp, tmp_set_pt):
	fan_upr_bnd = 5.32
	fan_lwr_bnd = 6.3
	calcd_sp = (fan_lwr_bnd / (1 + (1 - (tmp_set_pt/c_tmp))))
	if (calcd_sp < fan_upr_bnd):
		return 0
	else:
		if (calcd_sp > fan_lwr_bnd):
			return 8
		else:
			return calcd_sp

import fan_n_temp
   
run=True
i=0
GPIO.setmode(GPIO.BCM)        
GPIO.setup(13, GPIO.OUT)
fan = GPIO.PWM(13, 100)
fan.start(0)
tmp_set_pt = 70
m = AHT10(1)
RPM_GPIO = 26


pi = pigpio.pi()
p = fan_n_temp.reader(pi, RPM_GPIO, 2)
data = m.getData()
crnt_tmp = ((data[0]*(9/5)+32))
crnt_hum = data[1]
fn_sp = calc_fan_sp(crnt_tmp, tmp_set_pt)
fan.ChangeDutyCycle(fn_sp)
RPM = p.RPM()
print("Temperature is {} F\nHumidity is {}%\nFan speed: {}rpm".format(crnt_tmp, crnt_hum, int(RPM+0.5)))
#print("Temperature is {} F\nHumidity is {}%\nFan speed {}".format(crnt_tmp, crnt_hum, fn_sp))
#print("Temperature is {} F\nHumidity is {}%".format(((data[0]*(9/5)+32)), data[1]))

while run:
	fan.ChangeDutyCycle(fn_sp)
	sleep(1)
	data = m.getData()
	crnt_tmp = ((data[0]*(9/5)+32))
	crnt_hum = data[1]
	fn_sp = calc_fan_sp(crnt_tmp, tmp_set_pt)
	RPM = p.RPM()
	print("Temperature is {} F\nHumidity is {}%\nFan speed: {}rpm".format(crnt_tmp, crnt_hum, int(RPM+0.5)))
#	print("RPM is {} \nTemperature is {} F\nHumidity is {}%\nFan speed {}".format(int(RPM+0.5),crnt_tmp, crnt_hum, fn_sp))
	if (crnt_tmp > tmp_set_pt):
		i=0
	if (crnt_tmp < tmp_set_pt):
		i+=1
		print("i=",i)
		if(i >= 150):
			run=False
			

print ("Stop")
fan.ChangeDutyCycle(100)
fan.stop()
p.cancel()
pi.stop()
GPIO.cleanup()
