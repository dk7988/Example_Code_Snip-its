var https = require('https');
var db = require('./DomSun_db');
//const notifr = require('./emailer.js');
const { time } = require('console');


 var data2 = {
	"status":"OK",
	"copyright":"Copyright (c) 2023 Pro Publica Inc. All Rights Reserved.",
	"results":[
	   {
		  "id": "Y000033",
		  "member_id": "Y000033",
 
		  "first_name": "Don",
		  "middle_name": null,
		  "last_name": "Young",
		  "suffix": null,
		  "date_of_birth": "1933-06-09",
		  "gender": "M",
		  "url": null,
		  "times_topics_url": "http://topics.nytimes.com/top/reference/timestopics/people/y/don_young/index.html",
		  "times_tag": "Young, Don (Per)",
		  "govtrack_id": "400440",
		  "cspan_id": "1897",
		  "votesmart_id": "26717",
		  "icpsr_id": "14066",
		  "twitter_account": "RepDonYoung",
		  "facebook_account": "RepDonYoung",
		  "youtube_account": "RepDonYoung",
		  "crp_id": "N00007999",
		  "google_entity_id": "/m/024p1k",
		  "rss_url": "https://donyoung.house.gov/news/rss.aspx",
		  "in_office": false,
		  "current_party": "R",
		  "most_recent_vote": "2022-03-17",
		  "last_updated": "2022-12-23 15:03:11 -0500",
		  "roles": [
  {
			"congress": "117",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": "",
			"fec_candidate_id": "H6AK00045",
			"seniority": "50",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2021-01-03",
			"end_date": "2022-03-18",
			"office": "2314 Rayburn House Office Building",
			"phone": "202-225-5765",
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": 0.283,
			"ideal_point": null,
			"next_election": "2022",
			"total_votes": 530,
			"missed_votes": 43,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 51,
			"bills_cosponsored": 281,
			"missed_votes_pct": 8.11,
			"votes_with_party_pct": 87.97,
			"votes_against_party_pct": 11.83,
			"committees": [
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/117/house/committees/HSII.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2022-03-18"
			},
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/117/house/committees/HSPW.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2022-03-18"
			}
			],
			"subcommittees": [
			]
		  },
		 {
			"congress": "116",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "H6AK00045",
			"seniority": "48",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2019-01-03",
			"end_date": "2021-01-03",
			"office": "2314 Rayburn House Office Building",
			"phone": "202-225-5765",
			"fax": null,
			"contact_form": null,
			"cook_pvi": "R+9",
			"dw_nominate": 0.284,
			"ideal_point": null,
			"next_election": "2020",
			"total_votes": 954,
			"missed_votes": 58,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 54,
			"bills_cosponsored": 398,
			"missed_votes_pct": 6.08,
			"votes_with_party_pct": 88.29,
			"votes_against_party_pct": 11.60,
			"committees": [
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSII.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "2019-01-24",
			  "end_date": "2021-01-03"
			},
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSPW.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "2019-01-23",
			  "end_date": "2021-01-03"
			}
			],
			"subcommittees": [
			{
			  "name": "For Indigenous Peoples of the United States",
			  "code": "HSII24",
			  "parent_committee_id": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSII/subcommittees/HSII24.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "2019-01-30",
			  "end_date": "2021-01-03"
			},
			{
			  "name": "National Parks, Forests, and Public Lands",
			  "code": "HSII10",
			  "parent_committee_id": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSII/subcommittees/HSII10.json",
			  "side": "minority",
			  "title": "Ranking Member",
			  "rank_in_party": 1,
			  "begin_date": "2019-01-30",
			  "end_date": "2021-01-03"
			},
			{
			  "name": "Aviation",
			  "code": "HSPW05",
			  "parent_committee_id": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSPW/subcommittees/HSPW05.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2021-01-03"
			},
			{
			  "name": "Coast Guard and Maritime Transportation",
			  "code": "HSPW07",
			  "parent_committee_id": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSPW/subcommittees/HSPW07.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2021-01-03"
			},
			{
			  "name": "Highways and Transit",
			  "code": "HSPW12",
			  "parent_committee_id": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/116/house/committees/HSPW/subcommittees/HSPW12.json",
			  "side": "minority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2021-01-03"
			}
			]
		  },
		 {
			"congress": "115",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "H6AK00045",
			"seniority": "46",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2017-01-03",
			"end_date": "2019-01-03",
			"office": "2314 Rayburn House Office Building",
			"phone": "202-225-5765",
			"fax": "202-225-0425",
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": 0.279,
			"ideal_point": null,
			"next_election": "2018",
			"total_votes": 1211,
			"missed_votes": 44,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 71,
			"bills_cosponsored": 271,
			"missed_votes_pct": 3.63,
			"votes_with_party_pct": 90.89,
			"votes_against_party_pct": 9.11,
			"committees": [
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSII.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			},
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSPW.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			}
			],
			"subcommittees": [
			{
			  "name": "National Parks, Forests, and Public Lands",
			  "code": "HSII10",
			  "parent_committee_id": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSII/subcommittees/HSII10.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			},
			{
			  "name": "For Indigenous Peoples of the United States",
			  "code": "HSII24",
			  "parent_committee_id": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSII/subcommittees/HSII24.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			},
			{
			  "name": "Aviation",
			  "code": "HSPW05",
			  "parent_committee_id": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSPW/subcommittees/HSPW05.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			},
			{
			  "name": "Coast Guard and Maritime Transportation",
			  "code": "HSPW07",
			  "parent_committee_id": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSPW/subcommittees/HSPW07.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			},
			{
			  "name": "Highways and Transit",
			  "code": "HSPW12",
			  "parent_committee_id": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/115/house/committees/HSPW/subcommittees/HSPW12.json",
			  "side": "majority",
			  "title": "Member",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2019-01-03"
			}
			]
		  },
		 {
			"congress": "114",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "H6AK00045",
			"seniority": "44",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2015-01-06",
			"end_date": "2017-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": 0.279,
			"ideal_point": null,
			"next_election": "2016",
			"total_votes": 1311,
			"missed_votes": 77,
			"total_present": 4,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 64,
			"bills_cosponsored": 228,
			"missed_votes_pct": 5.87,
			"votes_with_party_pct": 91.61,
			"votes_against_party_pct": 8.31,
			"committees": [
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/114/house/committees/HSII.json",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2017-01-03"
			},
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/114/house/committees/HSPW.json",
			  "rank_in_party": 2,
			  "begin_date": "",
			  "end_date": "2017-01-03"
			}
			],
			"subcommittees": [
			]
		  },
		 {
			"congress": "113",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "42",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2013-01-03",
			"end_date": "2015-01-02",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": 0.279,
			"ideal_point": 0.473142383,
			"next_election": "2014",
			"total_votes": 1204,
			"missed_votes": 95,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 45,
			"bills_cosponsored": 313,
			"missed_votes_pct": 7.89,
			"votes_with_party_pct": 88.86,
			"votes_against_party_pct": 11.05,
			"committees": [
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/113/house/committees/HSII.json",
			  "rank_in_party": 2,
			  "begin_date": "2013-01-04",
			  "end_date": "2015-01-03"
			},
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/113/house/committees/HSPW.json",
			  "rank_in_party": 2,
			  "begin_date": "2013-01-04",
			  "end_date": "2015-01-03"
			}
			],
			"subcommittees": [
			]
		  },
		 {
			"congress": "112",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "40",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2011-01-04",
			"end_date": "2013-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": 0.279,
			"ideal_point": null,
			"next_election": "2012",
			"total_votes": 1607,
			"missed_votes": 178,
			"total_present": 1,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 65,
			"bills_cosponsored": 293,
			"missed_votes_pct": 11.08,
			"votes_with_party_pct": 87.24,
			"votes_against_party_pct": 12.69,
			"committees": [
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/112/house/committees/HSII.json",
			  "rank_in_party": 2,
			  "begin_date": "2011-01-18",
			  "end_date": "2013-01-03"
			},
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/112/house/committees/HSPW.json",
			  "rank_in_party": 2,
			  "begin_date": "2011-01-12",
			  "end_date": "2013-01-03"
			}
			],
			"subcommittees": [
			]
		  },
		 {
			"congress": "111",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "38",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2009-01-06",
			"end_date": "2011-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "2010",
			"total_votes": 1655,
			"missed_votes": 195,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 54,
			"bills_cosponsored": 377,
			"missed_votes_pct": 11.78,
			"votes_with_party_pct": 82.90,
			"votes_against_party_pct": 17.03,
			"committees": [
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/111/house/committees/HSPW.json",
			  "rank_in_party": 2,
			  "begin_date": "2009-01-09",
			  "end_date": "2011-01-03"
			},
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/111/house/committees/HSII.json",
			  "rank_in_party": 2,
			  "begin_date": "2009-01-09",
			  "end_date": "2011-01-03"
			}
			],
			"subcommittees": [
			]
		  },
		 {
			"congress": "110",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "36",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2007-01-04",
			"end_date": "2009-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1873,
			"missed_votes": 317,
			"total_present": 3,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 46,
			"bills_cosponsored": 366,
			"missed_votes_pct": 16.92,
			"votes_with_party_pct": 88.46,
			"votes_against_party_pct": 12.07,
			"committees": [
			{
			  "name": "Committee on Transportation and Infrastructure",
			  "code": "HSPW",
			  "api_uri": "https://api.propublica.org/congress/v1/110/house/committees/HSPW.json",
			  "rank_in_party": 2,
			  "begin_date": "2007-01-10",
			  "end_date": "2009-01-03"
			},
			{
			  "name": "Committee on Natural Resources",
			  "code": "HSII",
			  "api_uri": "https://api.propublica.org/congress/v1/110/house/committees/HSII.json",
			  "rank_in_party": 1,
			  "begin_date": "2007-01-04",
			  "end_date": "2009-01-03"
			}
			],
			"subcommittees": [
			]
		  },
		 {
			"congress": "109",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "34",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2005-01-04",
			"end_date": "2007-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1214,
			"missed_votes": 100,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 63,
			"bills_cosponsored": 146,
			"missed_votes_pct": 8.24,
			"votes_with_party_pct": 93.36,
			"votes_against_party_pct": 6.92,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "108",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "32",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2003-01-07",
			"end_date": "2005-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1221,
			"missed_votes": 155,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 59,
			"bills_cosponsored": 104,
			"missed_votes_pct": 12.69,
			"votes_with_party_pct": 96.79,
			"votes_against_party_pct": 3.40,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "107",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "30",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "2001-01-03",
			"end_date": "2003-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 996,
			"missed_votes": 181,
			"total_present": 1,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 65,
			"bills_cosponsored": 133,
			"missed_votes_pct": 18.17,
			"votes_with_party_pct": 96.75,
			"votes_against_party_pct": 3.75,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "106",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "28",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1999-01-06",
			"end_date": "2001-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1214,
			"missed_votes": 165,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 56,
			"bills_cosponsored": 154,
			"missed_votes_pct": 13.59,
			"votes_with_party_pct": 92.53,
			"votes_against_party_pct": 7.57,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "105",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "26",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1997-01-07",
			"end_date": "1999-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1187,
			"missed_votes": 209,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 50,
			"bills_cosponsored": 169,
			"missed_votes_pct": 17.61,
			"votes_with_party_pct": 92.27,
			"votes_against_party_pct": 8.15,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "104",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "24",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1995-01-04",
			"end_date": "1997-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1340,
			"missed_votes": 127,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 48,
			"bills_cosponsored": 141,
			"missed_votes_pct": 9.48,
			"votes_with_party_pct": 93.97,
			"votes_against_party_pct": 7.05,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "103",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "22",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1993-01-05",
			"end_date": "1995-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 1122,
			"missed_votes": 92,
			"total_present": 2,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"bills_sponsored": 27,
			"bills_cosponsored": 274,
			"missed_votes_pct": 8.20,
			"votes_with_party_pct": 84.47,
			"votes_against_party_pct": 14.83,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "102",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "20",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1991-01-03",
			"end_date": "1993-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": 933,
			"missed_votes": 72,
			"total_present": 0,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"missed_votes_pct": 7.72,
			"votes_with_party_pct": 80.12,
			"votes_against_party_pct": 16.43,
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "101",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "18",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1989-01-03",
			"end_date": "1991-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": null,
			"missed_votes": null,
			"total_present": null,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "100",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "16",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1987-01-06",
			"end_date": "1989-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": null,
			"missed_votes": null,
			"total_present": null,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "99",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "14",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1985-01-03",
			"end_date": "1987-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": null,
			"missed_votes": null,
			"total_present": null,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"committees": [
 ],
			"subcommittees": [
 ]
		  },
		 {
			"congress": "98",
			"chamber": "House",
			"title": "Representative",
			"short_title": "Rep.",
			"state": "AK",
			"party": "R",
			"leadership_role": null,
			"fec_candidate_id": "",
			"seniority": "12",
			"district": "At-Large", "at_large": true,
			"ocd_id": "ocd-division/country:us/state:ak/cd:1",
			"start_date": "1983-01-03",
			"end_date": "1985-01-03",
			"office": null,
			"phone": null,
			"fax": null,
			"contact_form": null,
			"cook_pvi": null,
			"dw_nominate": null,
			"ideal_point": null,
			"next_election": "",
			"total_votes": null,
			"missed_votes": null,
			"total_present": null,
			"senate_class": "",
			"state_rank": "",
			"lis_id": "",
			"committees": [
 ],
			"subcommittees": [
 ]
		  }
		]
		 }
	 ]
 };



let cntr=0
let _ids=[];
var _flg=0;
const _PP_api_url='https:\\\\api.propublica.org\\congress\\v1\\members\\~.json';
const _PP_hdrs= {
	headers: {
		'x-api-key' : 'ProPublic_api_key'
	}
};;

class DomSun_PP_db_conr{
	_PP_hdrs; 
	

constructor(){

}


async ___get_data_from_PP(){
	this.get_ids_from_db(function(ids){
		console.log(ids);

	});

}

async get_data_from_PP(){
	await this.get_ids_from_db(async function(ids){
		console.log(ids);
		_ids=ids;
		print_datetime('Starting goto_pp');
		goto_pp();
	});
}





proc_mem_data = async function(mem_data){
	
	console.log('%o',mem_data);
	//console.log('%o',mem_data.results);
	
	var mem_dtls=[
		mem_data.results[0].member_id,
		mem_data.results[0].first_name,
		mem_data.results[0].middle_name,
		mem_data.results[0].last_name,
		mem_data.results[0].suffix,
		mem_data.results[0].current_party,
		mem_data.results[0].date_of_birth,
		mem_data.results[0].gender,
		mem_data.results[0].govtrack_id,
		mem_data.results[0].cspan_id,
		mem_data.results[0].votesmart_id,
		mem_data.results[0].icpsr_id,		
		mem_data.results[0].crp_id,
		mem_data.results[0].google_entity_id,		
		mem_data.results[0].most_recent_vote,
		mem_data.results[0].last_updated.split(" ")[0],
		mem_data.results[0].url,
		mem_data.results[0].in_office
	]

	//console.log('mem_dtls:' + mem_dtls);
	//post - mem_dtls to db in mem_details table
	await db.POST_MEM_DETAILS(mem_dtls, async function(){

	


		var roles = mem_data.results[0].roles;
		for (let c = 0; c < roles.length; c++) {
			var role = roles[c];
			// var contte = role.committees;
			// var sub_contte = role.subcommittees;

			// console.log('role:');
			// console.log(role);

			var role_dtls=[
				mem_data.results[0].member_id,
				role.congress,
				role.chamber,
				role.title,
				role.state,
				role.party,
				role.leadership_role,
				role.fec_candidate_id,
				role.seniority,
				role.ocd_id,
				role.start_date,
				role.end_date,
				role.office,
				role.phone,
				role.cook_pvi,
				role.dw_nominate,
				role.ideal_point,
				role.next_election,
				role.total_votes,
				role.missed_votes,
				role.total_present,
				role.senate_class,
				role.state_rank,
				role.lis_id,
				role.bills_sponsored,
				role.bills_cosponsored,
				role.missed_votes_pct,
				role.votes_with_party_pct,
				role.votes_against_party_pct,
			]
		
				if (role.hasOwnProperty('district')){
					role_dtls.push(role.district);	
					role_dtls.push(role.at_large);
				}	
			
			//console.log('role_dtls:' + role_dtls + '      length: '+role_dtls.length );
			//post - role_dtls to db in roles table
			await db.POST_ROLES(role_dtls,[mem_data.results[0].member_id,role,role.party], async function(d){

				var contte_dtls=undefined
				var contte = d[1].committees;

				// console.log('contte:');
				// console.log(contte);

				try {
					if (contte.length>0){
						for (let r = 0; r < contte.length; r++) {
							contte_dtls=[
								d[1].congress,
								d[0],
								d[2],
								contte[r].name,
								contte[r].code,
								contte[r].side,
								contte[r].title,
								contte[r].rank_in_party,
								contte[r].begin_date,
								contte[r].end_date
							]

						//console.log('contte_dtls:' + contte_dtls);
						//post - contte_dtls to db in committees table
						await db.POST_COMMITTEES(contte_dtls, async function(){});
					
						}
					}
				} catch (error) {
					console.log(error)	
				}

				try {
					var sub_contte_dtls=undefined
					var sub_contte = d[1].subcommittees;

					// console.log('sub_contte:');
					// console.log(sub_contte);

					if (sub_contte.length>0){
						for (let t = 0; t < sub_contte.length; t++) {
							sub_contte_dtls=[
								d[1].congress,
								d[0],
								d[2],
								sub_contte[t].name,
								sub_contte[t].parent_committee_id,
								sub_contte[t].code,
								sub_contte[t].side,
								sub_contte[t].title,
								sub_contte[t].rank_in_party,
								sub_contte[t].begin_date,
								sub_contte[t].end_date
							]
							
							//console.log('sub_contte_dtls:' + sub_contte_dtls);
							//post - sub_contte_dtls to db in sub_committees table
							db.POST_SUB_COMMITTEES(sub_contte_dtls, function(){});
						}
					}
				} catch (error) {
					console.log(error)	
				}

			

			//process.stdout.write(mem_data);



			});
		}

	});






}






get_ids_from_db = async function(cb) {
	var a;
	db.get_mem_ids(function(d){
		cb(d);
	});
	
	
	//return ['Y000033','S001191','W000647'];
}






remove_from_ar(val,ar){
	var rtn_ar=[];
	try {
		for (let i = 0; i < ar.length; i++) {
			if (ar[i]!=val){
				rtn_ar.push(ar[i]);
			} 
			ar=[];
			if (rtn_ar!=undefined) ar=rtn_ar;
			//console.log(ar);
		}
		return rtn_ar	
	} catch (error) {
		console.log(error);
		return []
	}
	
}




};



module.exports = DomSun_PP_db_conr;




print_datetime = function(msg){
	let date_time = new Date();

// get current date
// adjust 0 before single digit date
let date = ("0" + date_time.getDate()).slice(-2);

// get current month
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

// get current year
let year = date_time.getFullYear();

// get current hours
let hours = date_time.getHours();

// get current minutes
let minutes = date_time.getMinutes();

// get current seconds
let seconds = date_time.getSeconds();

// prints date in YYYY-MM-DD format
//console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log( month + "/" + date + "/" + year + "  " + hours + ":" + minutes + ":" + seconds +"  -  "+msg);
}



const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const wait = async () => {
  //print_datetime('About to snooze without halting the event loop...');
  print_datetime('Started waiting');
  await snooze(30000);
  print_datetime('Finished waiting');
  //print_datetime('done!');
};




goto_pp = async function(){
	print_datetime('i = '+cntr +"  :  "+_ids[cntr]);
	//console.log('i = %d: '+_ids[cntr], cntr);

	https.get(String(_PP_api_url.replace("~", _ids[cntr])),_PP_hdrs, (res) => {
		let data = '';	
		res.on('data', (d) => {
			//process.stdout.write(d);
			data += d;
		});
		res.on('end', async () => {
			if (JSON.parse(data).status == "OK"){
				await wait();
				console.log(JSON.parse(data));
				proc_mem_data(JSON.parse(data), function(){
					cntr++
					print_datetime('Done with db, now going to goto_pp');
					goto_pp();
				});
			}else{
				cntr++
				print_datetime('Done with db, now going to goto_pp');
				goto_pp();
			}
			
		  });

	}).on('error', (e) => {
		console.error(e);
		cntr++
				print_datetime('Done with db, now going to goto_pp');
				goto_pp();
	});


	print_datetime('Finished goto_pp');
}



proc_mem_data = function(mem_data,cb){
	
	//console.log('%o',mem_data);
	//console.log('%o',mem_data.results);
	
	var mem_dtls=[
		mem_data.results[0].member_id,
		mem_data.results[0].first_name,
		mem_data.results[0].middle_name,
		mem_data.results[0].last_name,
		mem_data.results[0].suffix,
		mem_data.results[0].current_party,
		mem_data.results[0].date_of_birth,
		mem_data.results[0].gender,
		mem_data.results[0].govtrack_id,
		mem_data.results[0].cspan_id,
		mem_data.results[0].votesmart_id,
		mem_data.results[0].icpsr_id,		
		mem_data.results[0].crp_id,
		mem_data.results[0].google_entity_id,		
		mem_data.results[0].most_recent_vote,
		mem_data.results[0].last_updated.split(" ")[0],
		mem_data.results[0].url,
		mem_data.results[0].in_office
	]

	//console.log('mem_dtls:' + mem_dtls);
	//post - mem_dtls to db in mem_details table
	db.POST_MEM_DETAILS(mem_dtls, async function(){

	


		var roles = mem_data.results[0].roles;
		for (let c = 0; c < roles.length; c++) {
			var role = roles[c];
			// var contte = role.committees;
			// var sub_contte = role.subcommittees;

			// console.log('role:');
			// console.log(role);

			var role_dtls=[
				mem_data.results[0].member_id,
				role.congress,
				role.chamber,
				role.title,
				role.state,
				role.party,
				role.leadership_role,
				role.fec_candidate_id,
				role.seniority,
				role.ocd_id,
				role.start_date,
				role.end_date,
				role.office,
				role.phone,
				role.cook_pvi,
				role.dw_nominate,
				role.ideal_point,
				role.next_election,
				role.total_votes,
				role.missed_votes,
				role.total_present,
				role.senate_class,
				role.state_rank,
				role.lis_id,
				role.bills_sponsored,
				role.bills_cosponsored,
				role.missed_votes_pct,
				role.votes_with_party_pct,
				role.votes_against_party_pct,
			]
		
				if (role.hasOwnProperty('district')){
					role_dtls.push(role.district);	
					role_dtls.push(role.at_large);
				}	
			
			//console.log('role_dtls:' + role_dtls + '      length: '+role_dtls.length );
			//post - role_dtls to db in roles table
			await db.POST_ROLES(role_dtls,[mem_data.results[0].member_id,role,role.party], async function(d){

				var contte_dtls=undefined
				var contte = d[1].committees;

				// console.log('contte:');
				// console.log(contte);

				try {
					if (contte.length>0){
						for (let r = 0; r < contte.length; r++) {
							contte_dtls=[
								d[1].congress,
								d[0],
								d[2],
								contte[r].name,
								contte[r].code,
								contte[r].side,
								contte[r].title,
								contte[r].rank_in_party,
								contte[r].begin_date,
								contte[r].end_date
							]

						//console.log('contte_dtls:' + contte_dtls);
						//post - contte_dtls to db in committees table
						await db.POST_COMMITTEES(contte_dtls, async function(){});
					
						}
					}
				} catch (error) {
					console.log(error)	
				}

				try {
					var sub_contte_dtls=undefined
					var sub_contte = d[1].subcommittees;

					// console.log('sub_contte:');
					// console.log(sub_contte);

					if (sub_contte.length>0){
						for (let t = 0; t < sub_contte.length; t++) {
							sub_contte_dtls=[
								d[1].congress,
								d[0],
								d[2],
								sub_contte[t].name,
								sub_contte[t].parent_committee_id,
								sub_contte[t].code,
								sub_contte[t].side,
								sub_contte[t].title,
								sub_contte[t].rank_in_party,
								sub_contte[t].begin_date,
								sub_contte[t].end_date
							]
							
							//console.log('sub_contte_dtls:' + sub_contte_dtls);
							//post - sub_contte_dtls to db in sub_committees table
							db.POST_SUB_COMMITTEES(sub_contte_dtls, function(){});
						}
					}
				} catch (error) {
					console.log(error)	
				}

			

			//process.stdout.write(mem_data);


			});
		}

	});

cb();

}
