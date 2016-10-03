exports.emptyTankFields = '{"spotted":0,"avg_damage_blocked":0,"capture_points":0,"explosion_hits":0,"piercings":0,"xp":0,"survived_battles":0,"dropped_capture_points":0,"damage_dealt":0,"hits_percents":0,"draws":0,"battles":0,"damage_received":0,"frags":0,"direct_hits_received":0,"hits":0,"battle_avg_xp":0,"wins":0,"losses":0,"piercings_received":0,"no_damage_direct_hits_received":0,"shots":0,"explosion_hits_received":0,"tanking_factor":0}';

exports.tankIDs = [2417,3649,3681,3937,4145,5425,6145,6209,6225,6929,7169,7249,8481,8705,9233,9297,9489,10785,11841,12049,12305,12369,13089,13569,13825,13857,13889,13905,14113,14337,14609,14881,15425,15617,15905,16897,16913,17153,19217,55841,56865,58369,58641,61185,61697,18209,18449];

exports.sessionMin = 5;

exports.sessionsRequired = 3;

exports.sessionPriority = 'epg';

function calcMoeScore(rank){
	return Math.pow(1.06,100-rank*3);
}

exports.moecalcstring = "1.06^(100-rank*3)";

exports.calcMoeScore = calcMoeScore;



exports.maxScore = calcMoeScore(1);

exports.tankWeights = {
"2417": {//"Cz04 T50 51"
"overall_weight": 5,

"dpg": 2,
"epg": 5,
"kpg": 1,
"spg": 0.1,
"wr": 0.5
},
"3649": {//"Bat.Châtillon 25 t"
"overall_weight": 5,

"dpg": 2,
"epg": 5,
"kpg": 1,
"spg": 1,
"wr": 0.5
},
"3681": {//"STB1"
"overall_weight": 4,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.1,
"wr": 0.5
},
"3937": {//"Type 5 Heavy"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 1,
"spg": 0.1,
"wr": 0.5
},
"4145": {//"121"
"overall_weight": 4,

"dpg": 2,
"epg": 5,
"kpg": 1,
"spg": 0.1,
"wr": 0.5
},
"5425": {//"113"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"6145": {//"IS4"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"6209": {//"AMX 50 B"
"overall_weight": 5,

"dpg": 2,
"epg": 5,
"kpg": 1,
"spg": 0.1,
"wr": 0.5
},
"6225": {//"FV215b"
"overall_weight": 5,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"6929": {//"Maus"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"7169": {//"IS7"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"7249": {//"Centurion Action X"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"8481": {//"T92"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"8705": {//"Object 261"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"9233": {//"G.W. E 100"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"9297": {//"FV215b (183)"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"9489": {//"E 100"
"overall_weight": 2,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"10785": {//"T110E5"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"11841": {//"Bat.Châtillon 155 58"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"12049": {//"Jagdpanzer E 100"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"12305": {//"E 50 Ausf. M"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"12369": {//"Conqueror Gun Carriage"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"13089": {//"T110E4"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"13569": {//"Object 268"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"13825": {//"T62A"
"overall_weight": 2,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"13857": {//"T110E3"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"13889": {//"AMX 50 Foch (155)"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"13905": {//"FV4005 Stage II"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"14113": {//"M48A1 Patton"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"14337": {//"Object 263"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"14609": {//"Leopard 1"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"14881": {//"T57 Heavy Tank"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"15425": {//"AMX 30 B"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"15617": {//"Object 907"
"overall_weight": 5,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"15905": {//"M60"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"16897": {//"Object 140"
"overall_weight": 3,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"16913": {//"Waffenträger auf E 100"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"17153": {//"Object 430"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"18209": {//"T49"
"overall_weight": 2,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"18449": {//"Spähpanzer Ru 251"
"overall_weight": 2,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"19217": {//"G121 Grille 15 L63"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"55841": {//"T95E6"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"56865": {//"M48A2/T54E2/T123E6"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"58369": {//"Object 260"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"58641": {//"VK 72.01 (K)"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"61185": {//"Obj. 777 II"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
},
"61697": {//"T22 medium"
"overall_weight": 1,

"dpg": 1,
"epg": 5,
"kpg": 0.5,
"spg": 0.5,
"wr": 0.5
}
}