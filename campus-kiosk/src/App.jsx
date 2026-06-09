import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─────────────────────────── DATABASE LAYER ─────────────────────────── */
const INITIAL_DB = {
  locations: [
    //Building 1 - Ground Floor nodes
    { id:15, name:"Window 1", floor:1, building: 1, x:15, y:11, type:"Registrar", desc:"Registrar Office - Window 1" },
    { id:16, name:"Window 2", floor:1, building: 1, x:13.8, y:11, type:"Registrar", desc:"Registrar Office - Window 2" },
    { id:17, name:"Window 3", floor:1, building: 1, x:12.5, y:11, type:"Registrar", desc:"Registrar Office - Window 3" },
    { id:18, name:"Window 4", floor:1, building: 1, x:11.5, y:11.4, type:"Registrar", desc:"Registrar Office - Window 4" },
    { id:19, name:"Window 5", floor:1, building: 1, x:11.5, y:12.5, type:"Registrar", desc:"Registrar Office - Window 5" },
    { id:20, name:"Window 6", floor:1, building: 1, x:11.5, y:13.6, type:"Registrar", desc:"Registrar Office - Window 6" },
    { id:21, name:"Window 7", floor:1, building: 1, x:11.5, y:14.7, type:"Registrar", desc:"Registrar Office - Window 7" },
    { id:22, name:"Window 8", floor:1, building: 1, x:11.5, y:15.9, type:"Registrar", desc:"Registrar Office - Window 8" },
    { id:23, name:"Window 9", floor:1, building: 1, x:11.5, y:17.1, type:"Registrar", desc:"Registrar Office - Window 9" },
    { id:24, name:"Window 12", floor:1, building: 1, x:11.5, y:18.3, type:"Registrar", desc:"Registrar Office - Window 12" },
    { id:25, name:"Window 14", floor:1, building: 1, x:11.5, y:19.4, type:"Registrar", desc:"Registrar Office - Window 14" },
    { id:26, name:"Window 15", floor:1, building: 1, x:11.5, y:20.6, type:"Registrar", desc:"Registrar Office - Window 15" },
    { id:27, name:"Registrar's Office", floor:1, building: 1, x:15.5, y:13, type:"Registrar", desc:"Registrar Office" },
    { id:28, name:"Student Affairs Office", floor:1, building: 1, x:15.5, y:18, type:"office", desc:"Student affairs office." },
    { id:29, name:"CDJP Office", floor:1, building: 1, x:15.5, y:20, type:"office", desc:"CDJP office." },
    { id:30, name:"Exit", floor:1, building: 1, x:16.5, y:21, type:"exit", desc:"Guidance office." },
    { id:31, name:"Guidance Office", floor:1, building: 1, x:17.5, y:20, type:"office", desc:"Guidance office." },
    { id:32, name:"NSTP Office", floor:1, building: 1, x:17.5, y:17, type:"office", desc:"NSTP office." },
    { id:33, name:"Accounting Office", floor:1, building: 1, x:17.5, y:13, type:"Accounting", desc:"Accounting Office" },
    { id:34, name:"Window 1", floor:1, building: 1, x:17.7, y:11, type:"Accounting", desc:"Accounting Office - Window 1" },
    { id:35, name:"Window 2", floor:1, building: 1, x:18.3, y:11, type:"Accounting", desc:"Accounting Office - Window 2" },
    { id:36, name:"Window 3", floor:1, building: 1, x:18.9, y:11, type:"Accounting", desc:"Accounting Office - Window 3" },
    { id:37, name:"Window 4", floor:1, building: 1, x:19.5, y:11, type:"Accounting", desc:"Accounting Office - Window 4" },
    { id:38, name:"Window 5", floor:1, building: 1, x:20.1, y:11, type:"Accounting", desc:"Accounting Office - Window 5" },
    { id:39, name:"Window 6", floor:1, building: 1, x:20.5, y:12.1, type:"Accounting", desc:"Accounting Office - Window 6" },
    { id:40, name:"Window 7", floor:1, building: 1, x:20.5, y:13.2, type:"Accounting", desc:"Accounting Office - Window 7" },
    { id:41, name:"Window 8", floor:1, building: 1, x:20.5, y:14.3, type:"Accounting", desc:"Accounting Office - Window 8" },
    { id:42, name:"Window 9", floor:1, building: 1, x:20.5, y:15.4, type:"Accounting", desc:"Accounting Office - Window 9" },
    //Building 2 - Ground Floor nodes
    { id:10, name:"HRM Tools & Equipments", floor:1, building: 2, x:11.5, y:4, type:"laboratory", desc:"Engineering Laboratory." },
    { id:11, name:"B2.11", floor:1, building: 2, x:17, y:8, type:"laboratory", desc:"Computer Hardware Servicing, Electronics/Electrical Room." },
    { id:12, name:"B2.12", floor:1, building: 2, x:15, y:8, type:"lecture", desc:"Academic Lecture Room, AVR Extensison Room-2." },
    { id:13, name:"Supply Section", floor:1, building: 2, x:20.5, y:4, type:"office",    desc:"Office supplies and resources." },
    { id:14, name:"Library", floor:1, building: 2, x:20.5, y:1.5,  type:"library",   desc:"Reference books, reading area & Wi-Fi." },
    //Building 3 - Ground Floor nodes
    { id:1,  name:"Entrance", floor:1, building: 3, x:5.5, y:21, type:"entrance",  desc:"Security gate, visitor logbook & entrance." },
    { id:2,  name:"Admission Office", floor:1, building: 3, x:6.5,  y:19.8, type:"office",    desc:"Admission office." },
    { id:3,  name:"Clinic", floor:1, building: 3, x:4.5,  y:18.5, type:"clinic",    desc:"School nurse, first aid." },
    { id:4, name:"Testing Room", floor:1, building: 3, x:6.5, y:17.5, type:"office",   desc:"Lounge area for visitors." },
    { id:5, name:"Social Lounge", floor:1, building: 3, x:6.5, y:13.5, type:"lounge",   desc:"Lounge area for visitors." },
    { id:6, name:"Drug Testing Center", floor:1, building: 3, x:4.5, y:12, type:"clinic",  desc:"Drug testing services." },
    //Building 4 - Ground Floor nodes
    { id:8, name:"B4.13", floor:1, building: 4, x:10.5, y:6.5, type:"laboratory", desc:"Engineering Laboratory." },
    { id:9, name:"B4.14", floor:1, building: 4, x:10.5, y:4, type:"laboratory", desc:"Criminology/Forensic Laboratory." },

    //Building 2 - Third Floor nodes
    { id:200, name: "Kiosk (You Are Here)", floor:1, x:5.8, y:9.2, type:"entrance", desc:"Smart Campus Navigation Kiosk — beside the elevator." },

    //Building 1 - Second Floor nodes
    { id:48, name:"Office of the College Deans and Academic Coordinators", floor:2, building:1, x:16.5, y:12, type:"office"},
    { id:49, name:"Faculty Room & Lounge", floor:2, building:1, x:15.3, y:13.3, type:"faculty", desc:"Academic Teacher's Faculty Room."},
    { id:50, name:"Academic Affairs Office", floor:2, building:1, x:14.8, y:17, type:"office", desc:"Office of the Vice President."},
    { id:51, name:"Online Teaching Hub", floor:2, building:1, x:14.8, y:18.8, type:"faculty", desc:"ODEL / Open & Distance E-Learning."},
    { id:52, name:"B1.21", floor:2, building:1, x:17.8, y:13.3, type:"laboratory", desc:"Judicial Court Simulation Laboratory."},
    { id:53, name:"Dr. Consuelo L. Co", floor:2, building:1, x:17.8, y:15.5, type:"laboratory", desc:"Multi-Purpose Academic Hall."},
    { id:54, name:"B1.21", floor:2, building:1, x:17.8, y:17.5, type:"laboratory", desc:"Judicial Court Simulation Laboratory."},
    { id:55, name:"Office of the College Deans", floor:2, building:1, x:17.8, y:18.8, type:"laboratory", desc:"Academic Consultation Room 2 & 3."},

    //Building 2 - Second Floor nodes
    { id:"C1", name:"B2.21", floor:2, building: 2, x:15.5, y:6.5, type:"laboratory", desc:"Computer Laboratory 21." },
    { id:"C2", name:"B2.22", floor:2, building: 2, x:15.5, y:3.8, type:"laboratory", desc:"Computer Laboratory 22." },
    { id:"C3", name:"B2.23", floor:2, building: 2, x:15.5, y:2, type:"laboratory", desc:"Computer Laboratory 23." },
    { id:"C4", name:"B2.24", floor:2, building: 2, x:17.5, y:6.5, type:"laboratory", desc:"Computer Laboratory 24." },
    { id:"C5", name:"B2.25", floor:2, building: 2, x:17.5, y:3.8, type:"laboratory", desc:"Computer Laboratory 25." },
    { id:"C6", name:"B2.26", floor:2, building: 2, x:17.5, y:2, type:"laboratory", desc:"Computer Laboratory 26." },
    { id:"MIS", name:"MIS Faculty", floor:2, building: 2, x:16.5, y:1.5, type:"faculty", desc:"Management Information Systems Room." },
    { id:"B2-F", name:"Ladies' CR", floor:2, building: 2, x:20, y:9.8, type:"Restroom", desc:"Ladies' restroom with 3 stalls and 2 sinks." },

    //Building 3 - Second Floor nodes
    { id:56, name:"MIS Department", floor:2, building:3, x:7, y:13.3, type:"office", desc:"Technical office of MIS Employees."},
    { id:57, name:"Broadcasting Room", floor:2, building:3, x:7, y:17.5, type:"broadcasting", desc:"For broadcasting."},
    { id:58, name:"Media Arts Center", floor:2, building:3, x:7, y:19.5, type:"media arts", desc:"For media arts."},
    { id:59, name:"Office of the chairman", floor:2, building:3, x:4, y:19, type:"office", desc:"For chairman."},
    { id:60, name:"Boardroom", floor:2, building:3, x:4, y:16, type:"office", desc:"For board."},
    { id:61, name:"Boardroom", floor:2, building:3, x:4, y:13.3, type:"office", desc:"For board."},


    //Building 4 - Second Floor nodes
    { id:43, name:"B4.21", floor:2, building: 4, x:4.5, y:6, type:"laboratory", desc:"Cisco Networking Simulation Laboratory." },
    { id:44, name:"B4.22", floor:2, building: 4, x:4.5, y:2, type:"laboratory", desc:"Foreign Language / Speech Laboratory." },
    { id:45, name:"B4.23", floor:2, building: 4, x:6.5, y:6.5, type:"laboratory", desc:"Digital & Robotics Modeling Laboratory." },
    { id:46, name:"B4.24", floor:2, building: 4, x:6.5, y:3.8, type:"laboratory", desc:"E-Learning Hub." },
    { id:47, name:"B4.25", floor:2, building: 4, x:6.5, y:1.3, type:"faculty", desc:"Senior High School Department." },
    { id:"B4-F", name:"Ladies' CR", floor:2, building: 4, x:1.5, y:9.8, type:"Restroom", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
    { id:"B-CR", name:"Men's CR", floor:2, x:11, y:9.8, type:"restroom", desc:"Boys' restroom with 3 stalls and 2 sinks." },

    //HALLWAY/CORRIDOR nodes — Ground Floor
    { id:101, name: "Building 3 Hallway", floor:1, x:5.5, y:19.8, type:"hallway", desc:"Corridor near admission office." },
    { id:102, name: "Building 3 Hallway", floor:1, x:5.5, y:18.5, type:"hallway", desc:"Corridor in front of clinic." },
    { id:103, name: "Building 3 Hallway", floor:1, x:5.5, y:17.5, type:"hallway", desc:"Corridor in front of testing room." },
    { id:105, name: "Building 3 Hallway", floor:1, x:5.5, y:13.5, type:"hallway", desc:"Corridor in front of social lounge." },
    { id:106, name: "Building 3 Hallway", floor:1, x:5.5, y:12, type:"hallway", desc:"Corridor in front of drug testing center." },
    { id:107, name: "Building 3 & 4 Hallway", floor:1, x:5.5, y:10.5, type:"hallway", desc:"Hallway at Elevator/Building 4." },
    { id:108, name: "Building 4 Hallway", floor:1, x:8, y:10.5, type:"hallway", desc:"Hallway at Right Stairs." },
    { id:109, name: "Building 4 - Right Stairs", floor:1, x:8, y:9, type:"hallway", desc:"Building 4 Right Stairs." },
    { id:110, name: "Center Hallway", floor:1, x:11, y:10.5, type:"hallway", desc:"Center hallway connecting different buildings." },
    { id:111, name: "Building 2 & 4 Mid-Hallway", floor:1, x:11, y:6.5, type:"hallway", desc:"Corridor in front of B4.13." },
    { id:112, name: "Building 2 & 4 Mid-Hallway", floor:1, x:11, y:4, type:"hallway", desc:"Corridor in front of B4.14." },
    { id:113, name: "Registrar Windows' Hallway", floor:1, x:15, y:10.5, type:"hallway", desc:"In front of Window 1." },
    { id:114, name: "Registrar Windows' Hallway", floor:1, x:13.8, y:10.5, type:"hallway", desc:"In front of Window 2." },
    { id:115, name: "Registrar Windows' Hallway", floor:1, x:12.5, y:10.5, type:"hallway", desc:"In front of Window 3." },
    { id:116, name: "Building 1 & 2 Hallway", floor:1, x: 16.5, y: 10.5, type: "hallway", desc: "Corridor at Building 1 & 2."},
    { id:117, name: "Building 1 & 2 Side Hallway", floor:1, x: 21, y: 10.5, type: "hallway", desc: "Side Hallway at Building 1 & 2."},
    { id:118, name: "Building 2 - Side Hallway", floor:1, x: 21, y: 4, type: "hallway", desc: "In front of Supply Section."},
    { id:119, name: "Building 2 - Side Hallway", floor:1, x: 21, y: 1.5, type: "hallway", desc: "In front of Library."},
    { id:120, name: "Registrar Windows' Hallway", floor:1, x: 11, y:11.4, type: "hallway", dec: "In front of Window 4."},
    { id:121, name: "Registrar Windows' Hallway", floor:1, x: 11, y:12.5, type: "hallway", dec: "In front of Window 5."},
    { id:122, name: "Registrar Windows' Hallway", floor:1, x: 11, y:13.6, type: "hallway", dec: "In front of Window 6."},
    { id:123, name: "Registrar Windows' Hallway", floor:1, x: 11, y:14.7, type: "hallway", dec: "In front of Window 7."},
    { id:124, name: "Registrar Windows' Hallway", floor:1, x: 11, y:15.9, type: "hallway", dec: "In front of Window 8."},
    { id:125, name: "Registrar Windows' Hallway", floor:1, x: 11, y:17.1, type: "hallway", dec: "In front of Window 9."},
    { id:126, name: "Registrar Windows' Hallway", floor:1, x: 11, y:18.3, type: "hallway", dec: "In front of Window 12."},
    { id:127, name: "Registrar Windows' Hallway", floor:1, x: 11, y:19.4, type: "hallway", dec: "In front of Window 14."},
    { id:128, name: "Registrar Windows' Hallway", floor:1, x: 11, y:20.6, type: "hallway", dec: "In front of Window 15."},
    { id:129, name: "Building 1 Hallway", floor:1, x: 16.5, y:13, type: "hallway", dec: "In front of Registrar & Accounting Office."},
    { id:130, name: "Building 1 Hallway", floor:1, x: 16.5, y:18, type: "hallway", dec: "In front Student Affairs Office."},
    { id:131, name: "Building 1 Hallway", floor:1, x: 16.5, y:20, type: "hallway", dec: "In front of CDJP & Guidance Office."},
    { id:132, name: "Building 1 Hallway", floor:1, x: 16.5, y:17, type: "hallway", dec: "In front NSTP Office."},
    { id:133, name: "Building 4 Hallway", floor:1, x: 3.5, y:10.5, type: "hallway", dec: "Building 4 Hallway."},
    { id:134, name: "Building 4 - Left Stairs", floor:1, x: 3.5, y:9.5, type: "hallway", dec: "Building 4 - Left Stairs."},
    { id:135, name: "Building 2 Hallway", floor:1, x:14, y:10.5, type:"hallway", desc:"Building 2 Hallway." },
    { id:136, name: "Building 2 - Left Stairs", floor:1, x:14, y:9.5, type:"hallway", desc:"Building 2 - Left Stairs." },
    { id:137, name: "Accounting Windows' Hallway", floor:1, x: 17.7, y: 10.5, type: "hallway", desc: "Accounting - Window 1."},
    { id:138, name: "Accounting Windows' Hallway", floor:1, x: 18.3, y: 10.5, type: "hallway", desc: "Accounting - Window 2."},
    { id:139, name: "Accounting Windows' Hallway", floor:1, x: 18.9, y: 10.5, type: "hallway", desc: "Accounting - Window 3."},
    { id:140, name: "Accounting Windows' Hallway", floor:1, x: 19.5, y: 10.5, type: "hallway", desc: "Accounting - Window 4."},
    { id:141, name: "Accounting Windows' Hallway", floor:1, x: 20.1, y: 10.5, type: "hallway", desc: "Accounting - Window 5."},
    { id:142, name: "Building 1 - Side Hallway", floor:1, x: 21, y: 12.1, type: "hallway", desc: "In front of Window 6."},
    { id:143, name: "Building 1 - Side Hallway", floor:1, x: 21, y: 13.2, type: "hallway", desc: "In front of Window 7."},
    { id:144, name: "Building 1 - Side Hallway", floor:1, x: 21, y: 14.3, type: "hallway", desc: "In front of Window 8."},
    { id:145, name: "Building 1 - Side Hallway", floor:1, x: 21, y: 15.4, type: "hallway", desc: "In front of Window 9."},
    { id:146, name: "Building 2 Hallway", floor:1, x: 18, y: 10.5, type: "hallway", desc: "Building 2 Hallway."},
    { id:147, name: "Building 2 - Right Stairs", floor:1, x: 18, y: 9.5, type: "hallway", desc: "Building 2 Right Stairs."},
    { id:148, name: "Building 1 Hallway", floor:1, x: 16.5, y: 14.5, type: "hallway", desc: "Building 1 Hallway to Stairs."},  
    { id:149, name: "Building 1 Stairs", floor:1, x: 15.5, y: 14.5, type: "hallway", desc: "Building 1 Stairs."},
    { id:150, name: "Building 3 Hallway", floor:1, x: 5.5, y: 16, type: "hallway", desc: "To Building 3 Stairs."},
    { id:151, name: "Building 3 Stairs", floor:1, x: 8, y: 16, type: "hallway", desc: "Building 3 Stairs to 2nd Floor."},
    
    //HALLWAY/CORRIDOR nodes — Second Floor
    { id:"B4-2R", name: "Building 4 Right Stairs", floor:2, x:8, y:8.5, type: "hallway", dec: "Building 4 Right Stairs."},
    { id:"B4-2L", name: "Building 4 - Left Stairs", floor:2, x: 3.5, y:8.5, type: "hallway", dec: "Building 4 - Left Stairs."},
    { id:"B2-2R", name: "Building 2 - Right Stairs", floor:2, x: 18, y: 8.5, type: "hallway", desc: "Building 2 - Right Stairs."},
    { id:201, name: "Men's Restroom", floor:2, x:8, y:9.8, type: "hallway", dec: "Building 2 & 4 Men's Restroom."},
    { id:202, name: "Building 4 - Center Hallway", floor:2, x:5.5, y:8.5, type: "hallway", dec: "Building 4 - Center Hallway."},
    { id:203, name: "Building 4 Hallway", floor:2, x:5.5, y:6, type: "hallway", dec: "CISCO Room."},
    { id:204, name: "Building 4 Hallway", floor:2, x:5.5, y:2, type: "hallway", dec: "Speech Laboratory."},
    { id:205, name: "Building 4 Hallway", floor:2, x:5.5, y:6.5, type: "hallway", dec: "DRM Laboratory."},
    { id:206, name: "Building 4 Hallway", floor:2, x:5.5, y:3.8, type: "hallway", dec: "E-Learning Hub."},
    { id:207, name: "Building 4 Hallway", floor:2, x:5.5, y:1.3, type: "hallway", dec: "SHS Department."},
    { id:208, name: "Building 4 Hallway", floor:2, x:3.9, y:8.5, type: "hallway", dec: "Building 4 Hallway."},
    { id:209, name: "Building 4 - Ladies Restroom", floor:2, x:3.9, y:9.8, type: "hallway", dec: "Building 4 - Ladies Restroom."},
    { id:210, name: "Men's Restroom", floor:2, x:14.5, y:9.8, type: "hallway", dec: "Building 2 & 4 Men's Restroom."},
    { id:212, name: "Building 2 - Center Hallway", floor:2, x:16.5, y:8.5, type: "hallway", dec: "Building 2 - Center Hallway."},
    { id:213, name: "Building 2 Hallway", floor:2, x:16.5, y:6.5, type: "hallway", dec: "Computer Laboratory 21 & 24."},
    { id:214, name: "Building 2 Hallway", floor:2, x:16.5, y:3.8, type: "hallway", dec: "Computer Laboratory 22 & 25."},
    { id:215, name: "Building 2 Hallway", floor:2, x:16.5, y:2, type: "hallway", dec: "Computer Laboratory 23 & 26."},
    { id:216, name: "Building 2 - Ladies' Restroom", floor:2, x:18, y:9.8, type: "hallway", dec: "Building 2 - Ladies Restroom."},
    { id:217, name: "Building 2 Hallway", floor:2, x:14.5, y:8.5, type: "hallway", dec: "Building 2 Hallway."},
    { id:218, name: "Building 1 Stairs", floor:2, x: 15.5, y: 15.5, type: "hallway", desc: "Building 1 Stairs."},
    { id:219, name: "Building 1 Hallway", floor:2, x: 16.5, y: 15.5, type: "hallway", desc: "Building 1 Hallway."},
    { id:220, name: "Building 1 Hallway", floor:2, x: 16.5, y: 13.3, type: "hallway", desc: "In front of Faculty Room and B1.21."},
    { id:221, name: "Building 1 Hallway", floor:2, x: 16.5, y: 13.3, type: "hallway", desc: "Building 1 Hallway."},
    { id:222, name: "Building 1 Hallway", floor:2, x: 16.5, y: 17, type: "hallway", desc: "Building 1 Hallway."},
    { id:223, name: "Building 1 Hallway", floor:2, x: 16.5, y: 17.5, type: "hallway", desc: "In front of B2.21."},
    { id:224, name: "Building 1 Hallway", floor:2, x: 16.5, y: 18.8, type: "hallway", desc: "In front of ODEL & Deans Office."},
    { id:225, name: "Building 3 Stairs", floor:2, x: 8, y: 16, type: "hallway", desc: "Building 3 Stairs - 2nd Floor."},
    { id:226, name: "Building 3 Hallway", floor:2, x: 5.5, y: 16, type: "hallway", desc: "Building 3 Hallway."},
  ],

  edges:[
    //Building 1 - Ground Floor edges
    [107,113],[107,114],[107,115],[113,15],[114,16],[115,17],[116,129],[116,130],[116,131],[116,132],[116,148],[117,142],[117,143],[117,144],[117,145],[129,27],[129,30],
    [130,28],[131,29],[131,31],[132,32],[129,33],[116,137],[116,138],[116,139],[116,140],[116,141],[137,34],[138,35],[139,36],[140,37],[141,38],[142,39],[143,40],
    [144,41],[145,42],[148,149],[149,218],
    //Building 2 - Ground Floor edges
    [107,116],[107,117],[107,146],[112,10],[113,12],[114,116],[116,117],[116,11],[117,118],[118,13],[117,119],[119,14],[110,120],[110,121],[110,122],[110,123],[110,124],
    [110,125],[110,126],[110,127],[110,128],[110,135],[110,146],[120,18],[121,19],[122,20],[123,21],[124,22],[125,23],[126,24],[127,25],[128,26],[135,136],[146,147],
    //Building 3 - Ground Floor edges
    [1,101],[1,102],[1,103],[101,102],[101,103],[101,2],[102,104],[102,3],[103,4],[103,105],[103,104],[103,107],[104,106],[104,7],[105,5],[103,106],[106,6],
    [102,103],[105,106],[106,107],[107,108],[107,150],[108,109],[107,200],[200,107],[150,151],
    //Building 4 - Ground Floor edges
    [107,133],[109,"B4-2R"],[107,110],[110,111],[110,112],[111,112],[111,8],[112,9],[133,134],

    //Building 1 - Second Floor Edges
    [218,219],[219,48],[219,53],[219,220],[219,223],[219,224],[220,49],[220,52],[219,222],[222,50],[223,54],[224,51],[224,55],
    //Building 2 - Second Floor Edges
    [147,"B2-2R"],["B2-2R",212],[212,213],[212,214],[212,215],[213,"C1"],[213,"C4"],[214,"C2"],[214,"C5"],[215,"C3"],[215,"C6"],[213,"MIS"],["B2-2R",216],[216,"B2-F"],[212,217],
    [217,210],[210,"B-CR"],
    //Building 3 - Second Floor edges
    [151,225],[225,226],
    //Building 4 - Second Floor edges
    [109,"B4-2R"],[134,"B4-2L"],["B4-2R",202],[202,203],[202,204],[202,205],[202,206],[202,207],[202,208],[203,43],[204,44],[205,45],[206,46],[207,47],[208,209],[209,"B4-F"],
    ["B4-2R",201],[201,"B-CR"],
  ],
  announcements:[
    { id:1, title:"Enrollment Period Open",  body:"2nd Semester enrollment is now open. Visit the Registrar's Office.", date:"2026-05-20", priority:"high" },
    { id:2, title:"Library Hours Extended",  body:"Library is now open until 8:00 PM on weekdays.",                    date:"2026-05-22", priority:"normal" },
    { id:3, title:"Campus WiFi Maintenance", body:"WiFi will be offline May 28, 10PM–2AM for upgrades.",              date:"2026-05-25", priority:"normal" },
  ],
  users:[
    { id:1, username:"admin", password:"icct2026", role:"admin" },
    { id:2, username:"staff", password:"staff123", role:"staff" },
  ],
  nextId: { locations: 20, announcements: 4 }
};

const KIOSK_NODE_ID = 200;

/* ─────────────────────────── A* ALGORITHM ──────────────────────────── */
function heuristic(a, b, locs) {
  const la = locs.find(l=>l.id===a), lb = locs.find(l=>l.id===b);
  if(!la||!lb) return Infinity;
  return Math.sqrt((la.x-lb.x)**2+(la.y-lb.y)**2);
}
function aStar(start, goal, locs, edges) {
  if(start===goal) return [start];
  const adj={};
  edges.forEach(([a,b])=>{ if(!adj[a])adj[a]=[]; if(!adj[b])adj[b]=[]; adj[a].push(b); adj[b].push(a); });
  const open=new Set([start]), came={};
  const g={}, f={};
  locs.forEach(l=>{ g[l.id]=Infinity; f[l.id]=Infinity; });
  g[start]=0; f[start]=heuristic(start,goal,locs);
  while(open.size>0){
    let cur=[...open].reduce((b,n)=>f[n]<f[b]?n:b);
    if(cur===goal){ const p=[]; let c=cur; while(c!==undefined){p.unshift(c);c=came[c];} return p; }
    open.delete(cur);
    for(const nb of (adj[cur]||[])){
      const t=g[cur]+heuristic(cur,nb,locs);
      if(t<g[nb]){ came[nb]=cur; g[nb]=t; f[nb]=t+heuristic(nb,goal,locs); open.add(nb); }
    }
  }
  return [];
}
function getDirections(pathIds, locs) {
  if (pathIds.length < 2) return [];
  const directions = [];
  for (let i = 0; i < pathIds.length; i++) {
    const curr = locs.find(l => l.id === pathIds[i]);
    const next = locs.find(l => l.id === pathIds[i + 1]);
    const prev = locs.find(l => l.id === pathIds[i - 1]);
    if (!curr) continue;

    if (i === 0) {
      directions.push({ icon:"🚶", text:`Start at ${curr.name}`, sub:`Floor ${curr.floor} · ${curr.type}` });
      continue;
    }
    if (i === pathIds.length - 1) {
      directions.push({ icon:"🏁", text:`Arrive at ${curr.name}`, sub:`Floor ${curr.floor} · ${curr.type}` });
      continue;
    }

    // Calculate angle between previous→current→next
    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
    let turn = (angle2 - angle1) * (180 / Math.PI);
    if (turn > 180) turn -= 360;
    if (turn < -180) turn += 360;

    // Floor change detection
    const floorChange = next.floor !== curr.floor;
    const floorDiff = next.floor - curr.floor;

    let icon, text;
    if (floorChange) {
      icon = floorDiff > 0 ? "🔼" : "🔽";
      text = `${floorDiff > 0 ? "Go up" : "Go down"} to Floor ${next.floor} via stairs`;
    } else if (turn < -45) {
      icon = "↰"; text = `Turn left to ${next.name}`;
    } else if (turn > 45) {
      icon = "↱"; text = `Turn right to ${next.name}`;
    } else if (turn < -15) {
      icon = "↖"; text = `Turn left to ${next.name}`;
    } else if (turn > 15) {
      icon = "↗"; text = `Turn right to ${next.name}`;
    } else {
      icon = "⬆"; text = `Continue straight to ${next.name}`;
    }

    directions.push({ icon, text, sub:`Floor ${curr.floor} · ${curr.type}` });
  }
  return directions;
}


/* ─────────────────────────── QR SVG ──────────────────────────────── */
function makeQR(text) {
  let h=0; for(let i=0;i<text.length;i++) h=((h<<5)-h+text.charCodeAt(i))|0;
  const S=17, g=[];
  for(let r=0;r<S;r++){ g[r]=[]; for(let c=0;c<S;c++){ const s=(h^(r*31+c*97))*2654435761; g[r][c]=((s>>>16)&1)===1; } }
  [[0,0],[0,10],[10,0]].forEach(([br,bc])=>{
    for(let r=0;r<7;r++) for(let c=0;c<7;c++)
      if(br+r<S&&bc+c<S) g[br+r][bc+c]=(r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4));
  });
  return g;
}
function QRCode({ text, size=100 }) {
  const g=useMemo(()=>makeQR(text),[text]);
  const c=size/g.length;
  return (
    <svg width={size} height={size} style={{background:"#fff",borderRadius:4,display:"block",flexShrink:0}}>
      {g.map((row,r)=>row.map((on,c2)=>on?<rect key={`${r}-${c2}`} x={c2*c} y={r*c} width={c} height={c} fill="#111"/>:null))}
    </svg>
  );
}

/* ─────────────────────────── AUTH ──────────────────────────────────── */
function createToken(u){ return btoa(JSON.stringify({id:u.id,username:u.username,role:u.role,exp:Date.now()+3600000})); }
function parseToken(t){ try{ const p=JSON.parse(atob(t)); return p.exp>Date.now()?p:null; }catch{return null;} }

/* ─────────────────────────── CONSTANTS ─────────────────────────────── */
const TYPE_META = {
  entrance: { color:"#34d399", icon:"🚪" },
  office:   { color:"#60a5fa", icon:"🏢" },
  library:  { color:"#c084fc", icon:"📚" },
  lab:      { color:"#fbbf24", icon:"💻" },
  hall:     { color:"#f472b6", icon:"🎭" },
  canteen:  { color:"#fb923c", icon:"🍽️" },
  clinic:   { color:"#f87171", icon:"🏥" },
  classroom:{ color:"#22d3ee", icon:"🎓" },
  parking:  { color:"#94a3b8", icon:"🅿️" },
  chapel:   { color:"#fde68a", icon:"⛪" },
  restroom: { color:"#2dd4bf", icon:"🚻" },
};

/* ─────────────────────────── DESTINATION SEARCH BAR ─────────────────── */
function DestinationSearch({ locations, onSelect, selectedId }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Searchable locations — exclude hallways and the kiosk itself
  const searchable = useMemo(() =>
    locations.filter(l => l.type !== "hallway" && l.id !== KIOSK_NODE_ID),
    [locations]
  );

  // Selected location display name
  const selectedLoc = useMemo(() =>
    selectedId ? locations.find(l => l.id === selectedId) : null,
    [locations, selectedId]
  );

  // Fuzzy filter: match name, type, desc, floor
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show all grouped by type when empty
      return searchable.slice(0, 30);
    }
    return searchable.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q) ||
      (l.desc || "").toLowerCase().includes(q) ||
      `floor ${l.floor}`.includes(q) ||
      `fl ${l.floor}`.includes(q) ||
      `building ${l.building}`.includes(q)
    ).slice(0, 20);
  }, [query, searchable]);

  // Group results by type
  const grouped = useMemo(() => {
    const groups = {};
    results.forEach(loc => {
      const k = loc.type.toLowerCase();
      if (!groups[k]) groups[k] = [];
      groups[k].push(loc);
    });
    return groups;
  }, [results]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(() =>
    Object.values(grouped).flat(),
    [grouped]
  );

  const handleKey = (e) => {
    if (!open) { if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, flatResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === "Enter" && cursor >= 0) { pick(flatResults[cursor]); }
    else if (e.key === "Escape") { setOpen(false); setCursor(-1); }
  };

  const pick = (loc) => {
    setQuery("");
    setOpen(false);
    setCursor(-1);
    onSelect(loc.id);
  };

  const clear = () => {
    setQuery("");
    setOpen(false);
    setCursor(-1);
    onSelect(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (cursor >= 0 && listRef.current) {
      const item = listRef.current.querySelector(`[data-idx="${cursor}"]`);
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [cursor]);

  // Highlight matching text
  const highlight = (text, q) => {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: "#38bdf8", fontWeight: 800 }}>{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      {/* ── INPUT FIELD ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: open ? "#0a1628" : "#070d1a",
        border: `1.5px solid ${open ? "#38bdf8" : selectedId ? "#22c55e" : "#0f2040"}`,
        borderRadius: open ? "10px 10px 0 0" : 10,
        padding: "0 14px",
        transition: "border-color 0.15s, background 0.15s",
        boxShadow: open ? "0 0 0 3px rgba(56,189,248,0.08)" : "none",
      }}>
        {/* Icon */}
        <span style={{ fontSize: 18, flexShrink: 0, opacity: selectedId ? 1 : 0.4 }}>
          {selectedId
            ? (TYPE_META[selectedLoc?.type?.toLowerCase()]?.icon || "📍")
            : "🔍"}
        </span>

        {/* Text input */}
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setCursor(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          onKeyDown={handleKey}
          placeholder={selectedLoc ? selectedLoc.name : "Search destination — office, lab, floor…"}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: selectedId && !query ? "#22c55e" : "#f1f5f9",
            fontSize: 14,
            fontFamily: "'Courier New', monospace",
            fontWeight: selectedId && !query ? 800 : 400,
            letterSpacing: selectedId && !query ? 0.5 : 0,
            padding: "11px 0",
            caretColor: "#38bdf8",
          }}
        />

        {/* Clear / badges */}
        {selectedId && !query && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          }}>
            <span style={{
              background: "#052e16", border: "1px solid #064e2a",
              color: "#34d399", fontSize: 9, fontWeight: 800,
              padding: "2px 7px", borderRadius: 4, fontFamily: "monospace", letterSpacing: 1,
            }}>SELECTED</span>
            <button onClick={clear} style={{
              background: "transparent", border: "none", color: "#475569",
              cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px",
            }}>✕</button>
          </div>
        )}
        {query && (
          <button onClick={clear} style={{
            background: "transparent", border: "none", color: "#475569",
            cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px", flexShrink: 0,
          }}>✕</button>
        )}
        {!selectedId && !query && (
          <span style={{ color: "#1e3a5f", fontSize: 10, fontFamily: "monospace", flexShrink: 0 }}>
            {searchable.length} locations
          </span>
        )}
      </div>

      {/* ── DROPDOWN ── */}
      {open && (
        <div ref={listRef} style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
          background: "#070d1a",
          border: "1.5px solid #38bdf8",
          borderTop: "1px solid #0f2040",
          borderRadius: "0 0 10px 10px",
          maxHeight: 260,
          overflowY: "auto",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
        }}>
          {flatResults.length === 0 ? (
            <div style={{
              padding: "20px 16px", textAlign: "center",
              color: "#1e3a5f", fontFamily: "monospace", fontSize: 12,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              No locations match "<span style={{ color: "#38bdf8" }}>{query}</span>"
            </div>
          ) : (
            (() => {
              let globalIdx = 0;
              return Object.entries(grouped).map(([type, locs]) => (
                <div key={type}>
                  {/* Group header */}
                  <div style={{
                    padding: "5px 14px 3px",
                    background: "#040b18",
                    borderBottom: "1px solid #0a1628",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 12 }}>{TYPE_META[type]?.icon || "📍"}</span>
                    <span style={{
                      color: TYPE_META[type]?.color || "#94a3b8",
                      fontSize: 9, fontWeight: 800, fontFamily: "monospace",
                      letterSpacing: 2, textTransform: "uppercase",
                    }}>{type}</span>
                    <span style={{
                      marginLeft: "auto", color: "#1e3a5f",
                      fontSize: 9, fontFamily: "monospace",
                    }}>{locs.length}</span>
                  </div>

                  {/* Location rows */}
                  {locs.map(loc => {
                    const idx = globalIdx++;
                    const isActive = cursor === idx;
                    const isSelected = selectedId === loc.id;
                    return (
                      <div
                        key={loc.id}
                        data-idx={idx}
                        onMouseDown={() => pick(loc)}
                        onMouseEnter={() => setCursor(idx)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 14px",
                          background: isActive ? "#0a1f35" : isSelected ? "#052e16" : "transparent",
                          borderLeft: `3px solid ${isSelected ? "#22c55e" : isActive ? "#38bdf8" : "transparent"}`,
                          cursor: "pointer",
                          transition: "background 0.08s",
                        }}
                      >
                        {/* Floor badge */}
                        <div style={{
                          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                          background: isSelected ? "#052e16" : "#0a1628",
                          border: `1px solid ${isSelected ? "#22c55e" : "#1a3a5c"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexDirection: "column",
                        }}>
                          <span style={{ color: "#475569", fontSize: 7, fontFamily: "monospace", lineHeight: 1 }}>FL</span>
                          <span style={{ color: isSelected ? "#34d399" : "#94a3b8", fontSize: 11, fontWeight: 800, fontFamily: "monospace", lineHeight: 1 }}>{loc.floor}</span>
                        </div>

                        {/* Name + desc */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: isSelected ? "#34d399" : "#f1f5f9",
                            fontSize: 12, fontWeight: 700, lineHeight: 1.3,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {highlight(loc.name, query)}
                          </div>
                          {loc.desc && (
                            <div style={{
                              color: "#334155", fontSize: 10, fontFamily: "monospace",
                              marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>{loc.desc}</div>
                          )}
                        </div>

                        {/* Selected checkmark */}
                        {isSelected && (
                          <span style={{ color: "#22c55e", fontSize: 14, flexShrink: 0 }}>✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ));
            })()
          )}

          {/* Footer */}
          <div style={{
            padding: "6px 14px",
            background: "#040b18",
            borderTop: "1px solid #0a1628",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ color: "#0f2040", fontSize: 9, fontFamily: "monospace" }}>↑↓ NAVIGATE</span>
            <span style={{ color: "#0f2040", fontSize: 9, fontFamily: "monospace" }}>↵ SELECT</span>
            <span style={{ color: "#0f2040", fontSize: 9, fontFamily: "monospace" }}>ESC CLOSE</span>
            {query && (
              <span style={{ marginLeft: "auto", color: "#1e3a5f", fontSize: 9, fontFamily: "monospace" }}>
                {flatResults.length} result{flatResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── 2D MAP ─────────────────────────────────── */
function CampusMap({ locs, edges, path, onNode, fromId, toId, compact=false, visibleFloor=1, navStep=0, navStarted=false }) {
  const floorLocs = locs.filter(l => l.floor === visibleFloor);
  const W=compact?360:640, H=compact?340:480;
  const PAD=compact?18:24, xM=22, yM=22;
  const sx=x=>PAD+(x/xM)*(W-PAD*2);
  const sy=y=>PAD+(y/yM)*(H-PAD*2);
  const pathSet=new Set();
  for(let i=0;i<path.length-1;i++){ pathSet.add(`${path[i]}-${path[i+1]}`); pathSet.add(`${path[i+1]}-${path[i]}`); }

  // ── FLOOR LAYOUTS ──────────────────────────────────────────────────
  const FLOOR_BLOCKS = {
    1: [
    //Building blocks
      {x:11.5, y:11,w:10,h:10,label:"Building 1"},
      {x:11.5, y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
    
      //Hallways and corridors
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5, y:0, w:1, h:10,label:"Hallway"},
      {x:10.5, y:11,w:1, h:10,label:"Hallway"},
    
      //Building 1 - Floor 1 rooms
      {x:11.5,y:11, w:4, h:3,label:"Registrar's Office"},
      {x:11.5,y:14, w:1, h:7, label:"Registrar's Office"},
      {x:17.5,y:18.5, w:4, h:2.5,label:"Guidance Office"},
      {x:17.5,y:16, w:4, h:2.5,label:"NSTP Office"},
      {x:17.5,y:11, w:3, h:5, label:"Accounting Office"},
      {x:12.5,y:19, w:3, h:2,label:"CDJP Office"},
      {x:12.5, y:17, w:3, h:2,label:"Student Affairs Office"},
      {x:12.5, y:15.5, w:1.5, h:1.5,label:"Male Restroom"},
      {x:12.5, y:14, w:2.3, h:1.5,label:"Female Restroom"},
      {x:14.8, y:14, w:1.2, h:2, label:"Stairs"},

      // Building 2 - Floor 1 rooms
      {x:11.5, y:0, w:9, h:3, label:"Library"},
      {x:16, y:3, w:4.5, h:2.5,label:"Supply Section"},
      {x:11.5, y:3, w:4.5, h:2.5,label:"HRM Tools and Equipments"},
      {x:16, y:5.5, w:4.5, h:2.5,label:"Laboratory"},
      {x:12.5, y:5.5, w:3.5, h:2.5,label:"Multi-Purpose"},
      {x:11.5, y:5.5, w:1, h:2.5,label:"Electrical Room"},
      {x:11.5, y:8, w:2, h:1.5, label:""},
      {x:18.5, y:8, w:2, h:1.5, label:""},
      {x:12, y:8.5, w:2,h:1,label:"Stairs"},
      {x:18, y:8.5, w:2,h:1,label:"Stairs"},

      // Building 3 - Floor 1 rooms
      {x:0.5, y:17.5, w:4, h:3.5, label:"Clinic"},
      {x:0.5, y:11, w:4, h:3.3, label:"Drug Testing Room"},
      {x:6.5, y:18.5, w:4, h:2.5, label:"Admission Office"},
      {x:6.5, y:16.5, w:4, h:2, label:"Testing Room"},
      {x:6.5, y:11, w:4, h:4.5, label:"Social Lounge"},
      {x:7.5, y:15.5, w:3, h:1, label:"Stairs"},
      {x:2.8, y:16, w:1.7, h:1.5, label:"♿︎ Restroom"},
      {x:0.5, y:16, w:2.3, h:1.5, label:"Restroom"},
      {x:0.5, y:14.3, w:1.3, h:1.7, label:"Restroom"},
      
      // Building 4 - Floor 1 rooms
      {x:0.5, y:8, w:2, h:1.5, label:""},
      {x:8.5, y:8, w:2, h:1.5, label:""},
      {x:0.5, y:0, w:5, h:8, label:""},
      {x:5.5, y:0, w:5, h:2.6, label:""},
      {x:5.5, y:2.6, w:5, h:2.7, label:"Laboratory"},
      {x:5.5, y:5.3, w:5, h:2.7, label:"Laboratory"},
      {x:5, y:9, w:1, h:1, label:"Elevator"},
      {x:1.5, y:8.5, w:2, h:1, label:"Stairs"},
      {x:8, y:8.5, w:2, h:1, label:"Stairs"},
    ],
    2: [
      //Building blocks
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:4.4, y:9.5, w:2.3,h:0.5,},
      {x:10.5, y:9.5, w:1,h:0.5,},
      
      //Restrooms
      {x:10, y:8, w:2, h:1.5, label:"Restroom"},
      {x:20, y:8, w:1, h:2, label:"Restroom"},

      //Building 1 - Floor 2 rooms
      {x:14.8, y:14, w:1.2, h:2, label:"Stairs"},
      {x:15.6, y:19.7, w:1.4, h:1.3, label:"Stairs"},
      {x:17.8, y:18.3, w:3.7, h:2.7, label:"Office of the College Deans"},
      {x:17, y:19.2, w:0.8, h:1.8, label:"", strokeWidth:0.5},
      {x:17.8, y:16.8, w:3.7, h:1.5, label:"Judicial Court Simulation Lab"},
      {x:17.8, y:12.8, w:3.7, h:1.5, label:"Judicial Court Simulation Lab"},
      {x:17.8, y:14.3, w:3.7, h:2.5, label:"Multi-Purpose Academic Hall"},
      {x:11.5, y:11, w:10, h:1, label:"Office of the College Deans and Academic Coordinators"},
      {x:14.8, y:12, w:0.5, h:2, label:"", strokeWidth:0.5},
      {x:11.5, y:12, w:3.3, h:3, label:"Faculty Room & Lounge"},
      {x:14.8, y:19.2, w:0.8, h:1.8, label:"", strokeWidth:0.5},
      {x:11.5, y:18, w:3.3, h:3, label:"Online Teaching Hub"},
      {x:11.5, y:15, w:3.3, h:3, label:"Academic Affairs Office"},

      // Building 2 - Floor 2 rooms
      {x:15, y:9.3, w:2.5, h:0.7, label:"", strokeWidth:1,},
      {x:11.5, y:0, w:4, h:2.6, label:"Computer Laboratory"},
      {x:11.5, y:2.6, w:4, h:2.7, label:"Computer Laboratory"},
      {x:11.5, y:5.3, w:4, h:2.7, label:"Computer Laboratory"},
      {x:17.5, y:0, w:4, h:2.6, label:"Computer Laboratory"},
      {x:17.5, y:2.6, w:4, h:2.7, label:"Computer Laboratory"},
      {x:17.5, y:5.3, w:4, h:2.7, label:"Computer Laboratory"},
      {x:15.5, y:0, w:2, h:1.5, label:"MIS Room"},
      {x:12, y:8, w:2, h:1.5, label:"Stairs"},
      {x:18, y:8, w:2, h:1.5, label:"Stairs"},

      // Building 3 - Floor 2 rooms
      {x:0.5, y:11, w:3.5, h:3.3, label:"Board Room"},
      {x:0.5, y:14.3, w:3.5, h:3.3, label:"Board Room"},
      {x:0.5, y:17.6, w:3.5, h:3.4, label:"Office of the Chairman"},
      {x:7, y:16.5, w:3.5, h:2.3, label:"Broadcasting Room"},
      {x:7, y:18.7, w:3.5, h:2.3, label:"Media Arts Center"},
      {x:7, y:11, w:3.5, h:1.5, label:"Restroom"},
      {x:7, y:12.5, w:3.5, h:1.5, label:"MIS Department"},
      {x:7, y:14, w:3.5, h:1.5, label:""},
      {x:7.5, y:15.5, w:3, h:1, label:"Stairs"},
      {x:4.8, y:19.7, w:1.4, h:1.3, label:"Stairs"},

      // Building 4 - Floor 2 rooms
      {x:0.5, y:8, w:1, h:2,label:"Restroom"},
      {x:5, y:9, w:1, h:1, label:"Elevator"},
      {x:0.5, y:4, w:4, h:4, label:"CISCO Room"},
      {x:0.5, y:0, w:4, h:4, label:"Speech Laboratory"},
      {x:6.5, y:5.2, w:4, h:2.8, label:"DRM Laboratory"},
      {x:6.5, y:2.5, w:4, h:2.7, label:"E-Learning Hub"},
      {x:6.5, y:0, w:4, h:2.5, label:"Senior High School Department"},
      {x:1.5, y:8, w:2, h:1.5, label:"Stairs"},
      {x:8, y:8, w:2, h:1.5, label:"Stairs"},
    ],
    3: [
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5,y:0, w:1, h:10,label:"Hallway"},
      {x:10.5,y:11,w:1, h:10,label:"Hallway"},
      {x:4.5, y:8, w:2, h:2, label:"Elevator"},
      {x:8,   y:8, w:2.5,h:2,label:"Stairs"},
      {x:0.5, y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:8, w:2.5,h:2,label:"Stairs"},
      {x:18,  y:8, w:2.5,h:2,label:"Stairs"},
    ],
    4: [
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5,y:0, w:1, h:10,label:"Hallway"},
      {x:10.5,y:11,w:1, h:10,label:"Hallway"},
      {x:4.5, y:8, w:2, h:2, label:"Elevator"},
      {x:8,   y:8, w:2.5,h:2,label:"Stairs"},
      {x:0.5, y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:8, w:2.5,h:2,label:"Stairs"},
      {x:18,  y:8, w:2.5,h:2,label:"Stairs"},
    ],
  };

  const FLOOR_LABELS = {
    1: "GROUND FLOOR", 2: "SECOND FLOOR", 3: "THIRD FLOOR",
    4: "FOURTH FLOOR", 5: "FIFTH FLOOR", 6: "SIXTH FLOOR", 7: "SEVENTH FLOOR",
  };

  const BLOCKS = FLOOR_BLOCKS[visibleFloor] || FLOOR_BLOCKS[1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%"
      style={{background:"#070d1a",borderRadius:10,border:"1px solid #1a2744",display:"block"}}>
      {BLOCKS.map((b,i)=>(
        <g key={i}>
          <rect
            x={sx(b.x)} y={sy(b.y)}
            width={sx(b.x+b.w)-sx(b.x)}
            height={sy(b.y+b.h)-sy(b.y)}
            fill="#0d1b2e"
            stroke={b.stroke ?? "#1a3a5c"}
            strokeWidth={b.strokeWidth ?? 1.5}
            opacity={b.opacity ?? 0.9}
          />
          {(() => {
            const cx = (sx(b.x) + sx(b.x + b.w)) / 2;
            const cy = (sy(b.y) + sy(b.y + b.h)) / 2;
            const blockW = sx(b.x + b.w) - sx(b.x);
            const fontSize = compact ? 4 : 6;
            const charsPerLine = Math.max(4, Math.floor(blockW / (fontSize * 0.62)));
            const words = (b.label || "").split(" ");
            const lines = [];
            let current = "";
            for (const word of words) {
              const test = current ? `${current} ${word}` : word;
              if (test.length > charsPerLine && current) { lines.push(current); current = word; }
              else { current = test; }
            }
            if (current) lines.push(current);
            const lineHeight = fontSize + 2;
            const totalH = lines.length * lineHeight;
            const startY = cy - totalH / 2 + lineHeight / 2;
            return lines.map((line, i) => (
              <text key={i} x={cx} y={startY + i * lineHeight}
                textAnchor="middle" dominantBaseline="middle"
                style={{fontSize, fill:"#2a4a6e", fontFamily:"monospace", userSelect:"none", pointerEvents:"none"}}>
                {line}
              </text>
            ));
          })()}
        </g>
      ))}
      <text x={sx(11)} y={sy(22.5)} textAnchor="middle"
        style={{fontSize:15,fill:"#ffffff",fontFamily:"monospace"}}>
        {FLOOR_LABELS[visibleFloor] || `FLOOR ${visibleFloor}`}
      </text>
      {edges.map(([a,b],i)=>{
        const la=floorLocs.find(l=>l.id===a),lb=floorLocs.find(l=>l.id===b); if(!la||!lb) return null;
        const active=pathSet.has(`${a}-${b}`);
        return <path key={i} d={`M${sx(la.x)},${sy(la.y)} L${sx(lb.x)},${sy(lb.y)}`}
          stroke={active?"#38bdf8":"#1a3a5c"} strokeWidth={active?2.5:1} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={active?"none":"4,3"} fill="none" opacity={active?1:0.4}/>;
      })}
      {path.length > 1 && navStarted && (() => {
        const la = floorLocs.find(l => l.id === path[navStep]);
        const lb = floorLocs.find(l => l.id === path[navStep + 1]);
        if (!la || !lb) return null;
        return (
          <g key={`anim-${navStep}`}>
            <path id={`ps-cur`} d={`M${sx(la.x)},${sy(la.y)} L${sx(lb.x)},${sy(lb.y)}`} fill="none" stroke="none"/>
            <circle r={compact ? 3 : 3} fill="#38bdf8" opacity=".9">
              <animateMotion dur="2s" repeatCount="indefinite">
                <mpath href="#ps-cur"/>
              </animateMotion>
            </circle>
          </g>
        );
      })()}
      {floorLocs.filter(loc => loc.type !== "hallway").map(loc => {
        const isF=fromId===loc.id, isT=toId===loc.id, inP=path.includes(loc.id);
        const isKiosk = loc.id === KIOSK_NODE_ID;
        const meta=TYPE_META[loc.type]||{color:"#94a3b8",icon:"📍"};
        const r=compact?(isF||isT?10:inP?11:9):(isF||isT?10:inP?9:7);
        return (
          <g key={loc.id} style={{cursor:"pointer"}} onClick={()=>onNode(loc)}>
            {(isF||isT||isKiosk)&&<circle cx={sx(loc.x)} cy={sy(loc.y)} r={r+6}
              fill={isKiosk?"#0ea5e922":isF?"#22c55e22":"#ef444422"}>
              <animate attributeName="r" values={`${r+4};${r+9};${r+4}`} dur="2s" repeatCount="indefinite"/>
            </circle>}
            <circle cx={sx(loc.x)} cy={sy(loc.y)} r={r}
              fill={isKiosk?"#0c2240":isF?"#166534":isT?"#7f1d1d":inP?"#0c2d48":"#0d1b2e"}
              stroke={isKiosk?"#0ea5e9":isF?"#22c55e":isT?"#ef4444":inP?"#38bdf8":meta.color}
              strokeWidth={isF||isT||isKiosk?2.5:1.5}/>
            <text x={sx(loc.x)} y={sy(loc.y)} textAnchor="middle" dominantBaseline="middle"
              style={{fontSize:compact?5.5:6,fill:isF||isT||isKiosk?"#fff":"#cbd5e1",fontFamily:"monospace",fontWeight:700,pointerEvents:"none"}}>
              {isKiosk ? "📍" : loc.id}
            </text>
            {!compact&&<text x={sx(loc.x)} y={sy(loc.y)+r+6} textAnchor="middle"
              style={{fontSize:5.5,fill:isKiosk?"#0ea5e9":meta.color,fontFamily:"monospace",pointerEvents:"none"}}>
              {loc.name.length>14?loc.name.slice(0,13)+"…":loc.name}
            </text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────── FLOOR TRANSITION OVERLAY ─────────────────── */
const FLOOR_NAMES = ['','GROUND FLOOR','SECOND FLOOR','THIRD FLOOR','FOURTH FLOOR','FIFTH FLOOR'];

function FloorTransitionOverlay({ data, onDone }) {
  const [phase, setPhase] = useState('in');
  useEffect(() => {
    if (!data) return;
    const enterTimer = setTimeout(() => setPhase('in'), 0);
    const holdTimer = setTimeout(() => setPhase('out'), 650);
    return () => { clearTimeout(enterTimer); clearTimeout(holdTimer); };
  }, [data]);
  useEffect(() => {
    if (phase === 'out') {
      const exitTimer = setTimeout(() => onDone(), 650);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, onDone]);
  if (!data) return null;
  const isUp = data.direction === 'up';
  const curtainStyle = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: '#020917',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    animation: phase === 'out'
      ? 'ft-slide-out 0.25s cubic-bezier(.4,0,.2,1) forwards'  // match exitTimer ÷ 1000
      : 'ft-slide-in 0.2s cubic-bezier(.4,0,.2,1) forwards',   // slide-in speed
    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(56,189,248,0.02) 3px,rgba(56,189,248,0.02) 4px)',
  };
  const cardStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    opacity: phase === 'in' ? 0 : 1,
    transform: phase === 'in' ? 'scale(0.88)' : 'scale(1)',
    transition: 'opacity 0.5s 0.15s ease, transform 0.5s 0.15s ease',  // was 0.3s 0.25s
  };
  return (
    <div style={curtainStyle} onClick={onDone}>
      <div style={cardStyle}>
        <div style={{ color: '#334155', fontSize: 12, letterSpacing: 3, fontFamily: 'monospace' }}>FROM FLOOR {data.fromFloor}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {isUp && <div style={{ fontSize: 52, lineHeight: 1, animation: 'ft-bounce 0.7s ease infinite alternate', color: '#38bdf8' }}>↑</div>}
          <div style={{ display: 'flex', flexDirection: isUp ? 'column' : 'column-reverse', gap: 5, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#38bdf8', animation: `ft-dot 1s ${0.15 * i + 0.5}s infinite` }}/>
            ))}
          </div>
          {!isUp && <div style={{ fontSize: 52, lineHeight: 1, animation: 'ft-bounce 0.7s ease infinite alternate', color: '#38bdf8' }}>↓</div>}
        </div>
        <div style={{ color: '#f1f5f9', fontSize: 44, fontWeight: 900, letterSpacing: 4, fontFamily: "'Courier New',monospace", lineHeight: 1 }}>FLOOR {data.toFloor}</div>
        <div style={{ color: '#38bdf8', fontSize: 11, letterSpacing: 4, fontFamily: 'monospace' }}>{FLOOR_NAMES[data.toFloor] || `FLOOR ${data.toFloor}`}</div>
        <div style={{ color: '#475569', fontSize: 11, letterSpacing: 2, fontFamily: 'monospace', marginTop: 4 }}>VIA {data.via.toUpperCase()}</div>
        <div style={{ color: '#1e3a5f', fontSize: 10, fontFamily: 'monospace', marginTop: 12 }}>TAP TO CONTINUE</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── IDLE SCREEN ──────────────────────────── */
function IdleScreen({ onTouch, announcements }) {
  const [tick, setTick]=useState(0);
  const [time, setTime]=useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>{ setTick(x=>(x+1)%announcements.length); setTime(new Date()); },4000); return()=>clearInterval(t); },[announcements.length]);
  const ann=announcements[tick];
  const hh=time.getHours().toString().padStart(2,"0");
  const mm=time.getMinutes().toString().padStart(2,"0");
  const days=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return (
    <div onClick={onTouch} style={{
      width:"100%",height:"100%",display:"flex",flexDirection:"column",
      background:"linear-gradient(135deg,#020917 0%,#030e22 50%,#040a18 100%)",
      cursor:"pointer",overflow:"hidden",position:"relative",userSelect:"none"
    }}>
      <div style={{position:"absolute",top:"20%",left:"10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#0ea5e920,transparent 70%)",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",bottom:"15%",right:"8%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,#6366f115,transparent 70%)",filter:"blur(40px)"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 36px",borderBottom:"1px solid #0f2040",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#0ea5e9,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏫</div>
          <div>
            <div style={{color:"#e2e8f0",fontSize:15,fontWeight:800,letterSpacing:1,fontFamily:"Georgia,serif"}}>ICCT COLLEGES</div>
            <div style={{color:"#38bdf8",fontSize:10,letterSpacing:3,fontFamily:"monospace"}}>CAINTA CAMPUS · SMART KIOSK</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#f1f5f9",fontSize:36,fontWeight:800,fontFamily:"'Courier New',monospace",letterSpacing:4,lineHeight:1}}>{hh}<span style={{color:"#38bdf8",animation:"blink 1s step-end infinite"}}>:</span>{mm}</div>
          <div style={{color:"#64748b",fontSize:10,letterSpacing:2,fontFamily:"monospace"}}>{days[time.getDay()]} · {months[time.getMonth()]} {time.getDate()}, {time.getFullYear()}</div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,zIndex:2}}>
        <div style={{fontSize:60,lineHeight:1}}>🗺️</div>
        <div style={{color:"#f1f5f9",fontSize:32,fontWeight:900,fontFamily:"Georgia,serif",letterSpacing:1,textAlign:"center"}}>Campus Navigation</div>
        <div style={{color:"#475569",fontSize:14,fontFamily:"monospace",letterSpacing:2}}>FIND YOUR WAY AROUND CAMPUS</div>
        <div style={{
          marginTop:20,padding:"14px 48px",
          background:"linear-gradient(90deg,#0ea5e9,#6366f1)",
          borderRadius:50,color:"#fff",fontSize:16,fontWeight:800,letterSpacing:2,
          fontFamily:"monospace",
          boxShadow:"0 0 32px #0ea5e960",
          animation:"pulse 2s ease-in-out infinite",
        }}>▶  TOUCH TO BEGIN</div>
      </div>
      <div style={{borderTop:"1px solid #0f2040",padding:"12px 36px",display:"flex",alignItems:"center",gap:16,zIndex:2}}>
        <div style={{background:ann?.priority==="high"?"#7f1d1d":"#0f2040",border:`1px solid ${ann?.priority==="high"?"#ef4444":"#1e3a5f"}`,borderRadius:4,padding:"2px 10px",color:ann?.priority==="high"?"#fca5a5":"#38bdf8",fontSize:9,fontWeight:800,fontFamily:"monospace",letterSpacing:1,flexShrink:0}}>
          {ann?.priority==="high"?"🔴 URGENT":"📢 BULLETIN"}
        </div>
        <div style={{color:"#94a3b8",fontSize:13,fontFamily:"monospace",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
          <span style={{color:"#f1f5f9",fontWeight:700}}>{ann?.title}</span> — {ann?.body}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 32px #0ea5e960}50%{box-shadow:0 0 52px #0ea5e9cc}} @keyframes blink{50%{opacity:0}}
        @keyframes ft-slide-in{from{transform:translateY(-100%)}to{transform:translateY(0)}} @keyframes ft-slide-out{from{transform:translateY(0)}to{transform:translateY(100%)}}
        @keyframes ft-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes ft-dot{0%,100%{opacity:.15}50%{opacity:1}}`}
      </style>
    </div>
  );
}

/* ═══════════════════════════ MAIN KIOSK APP ══════════════════════════ */
export default function App() {
  const [visibleFloor, setVisibleFloor] = useState(1);
  const [db, setDb]=useState(()=>{
    const d={...INITIAL_DB, locations:INITIAL_DB.locations.map((l,i)=>({
      ...l,
      id: l.id !== undefined ? l.id : 300 + i,
      qr:`icct://campus/loc/${l.id !== undefined ? l.id : 300+i}?name=${encodeURIComponent(l.name)}`
    }))};
    return d;
  });
  const [screen, setScreen]=useState("idle");
  const [session, setSession]=useState(()=>{
    try {
      const t = localStorage.getItem("campusnav_session");
      const s = t ? parseToken(t) : null;
      return s ? {...s, token:t} : null;
    } catch { return null; }
  });
  const [path, setPath]=useState([]);
  const [fromId, setFromId]=useState(KIOSK_NODE_ID);
  const [toId, setToId]=useState(null);
  const [navStep, setNavStep]=useState(0);
  const [navStarted, setNavStarted]=useState(false);
  const [selNode, setSelNode]=useState(null);
  const [qrLoc, setQrLoc]=useState(null);
  const [adminTab, setAdminTab]=useState("locations");
  const [loginF, setLoginF]=useState({u:"",p:"",err:""});
  const [newLoc, setNewLoc]=useState({name:"",floor:1,x:10,y:10,type:"classroom",desc:""});
  const [editLoc, setEditLoc]=useState(null);
  const [newAnn, setNewAnn]=useState({title:"",body:"",priority:"normal"});
  const [toast, setToast]=useState(null);
  const idleTimer=useRef(null);
  const [floorTransition, setFloorTransition] = useState(null);

  const triggerFloorTransitionIfNeeded = useCallback((stepIndex, directions, locs, path) => {
    const dir = directions[stepIndex];
    if (!dir) return;
    const currId = path[stepIndex];
    const nextId = path[stepIndex + 1];
    if (!currId || !nextId) return;
    const curr = locs.find(l => l.id === currId);
    const next = locs.find(l => l.id === nextId);
    if (!curr || !next || curr.floor === next.floor) return;
    const isUp = next.floor > curr.floor;
    const via = (curr.type === 'elevator' || next.type === 'elevator') ? 'Elevator' : 'Stairs';
    setFloorTransition({ direction: isUp ? 'up' : 'down', fromFloor: curr.floor, toFloor: next.floor, via });
    setVisibleFloor(next.floor);
  }, []);

  useEffect(()=>{
    if(session?.token) localStorage.setItem("campusnav_session", session.token);
    else localStorage.removeItem("campusnav_session");
  },[session]);

  const resetIdle=useCallback(()=>{
    clearTimeout(idleTimer.current);
    if(screen!=="idle") idleTimer.current=setTimeout(()=>{ setScreen("idle"); setPath([]); setFromId(KIOSK_NODE_ID); setToId(null); setSelNode(null); setVisibleFloor(1); },300000);
  },[screen]);
  useEffect(()=>{ document.addEventListener("click",resetIdle); return()=>document.removeEventListener("click",resetIdle); },[resetIdle]);
  useEffect(()=>{ resetIdle(); },[resetIdle, screen]);

  const toast_show=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const doLogin=()=>{
    const u=db.users.find(x=>x.username===loginF.u&&x.password===loginF.p);
    if(!u){setLoginF(f=>({...f,err:"Invalid credentials."}));return;}
    setSession({...u,token:createToken(u)}); setLoginF({u:"",p:"",err:""}); toast_show(`Welcome, ${u.username}!`);
  };

  // eslint-disable-next-line no-unused-vars
  const doNavigate=useCallback((destinationId)=>{
    const target = destinationId ?? toId;
    if(!fromId||!target){toast_show("Select a destination first.","err");return;}
    const r=aStar(fromId, target, db.locations, db.edges);
    setPath(r); setNavStep(0);
    if(r.length===0) toast_show("No path found to that location.","err");
    else toast_show(`Route found — ${r.length} stops via A*.`);
  },[fromId, toId, db.locations, db.edges]);

  // Auto-navigate as soon as a destination is selected
  const handleDestinationSelect = useCallback((locId) => {
    setToId(locId);
    setPath([]);
    setNavStep(0);
    setNavStarted(false);
    if (locId) {
      const r = aStar(KIOSK_NODE_ID, locId, db.locations, db.edges);
      setPath(r);
      setNavStep(0);
      if (r.length === 0) toast_show("No path found to that location.", "err");
      else {
        const dest = db.locations.find(l => l.id === locId);
        if (dest?.floor) setVisibleFloor(dest.floor);
        toast_show(`Route to ${dest?.name} — ${r.length} stops.`);
      }
    }
  }, [db.locations, db.edges]);

  const clearNav=()=>{ 
    setPath([]); 
    setFromId(KIOSK_NODE_ID); 
    setToId(null); 
    setNavStep(0); 
    setNavStarted(false);
    setVisibleFloor(1);
  };

  const handleNode=(loc)=>{
    if(loc.id === KIOSK_NODE_ID) return; // don't select kiosk as destination
    if(screen==="navigate"){
      handleDestinationSelect(loc.id);
    } else { setSelNode(loc); }
  };

  const addLoc=()=>{
    if(!newLoc.name.trim()){toast_show("Name required.","err");return;}
    const id=db.nextId.locations;
    const loc={...newLoc,id,floor:+newLoc.floor,x:+newLoc.x,y:+newLoc.y,qr:`icct://campus/loc/${id}?name=${encodeURIComponent(newLoc.name)}`};
    setDb(d=>({...d,locations:[...d.locations,loc],nextId:{...d.nextId,locations:id+1}}));
    setNewLoc({name:"",floor:1,x:10,y:10,type:"classroom",desc:""});
    toast_show("Location added!");
  };
  const delLoc=(id)=>{ setDb(d=>({...d,locations:d.locations.filter(l=>l.id!==id),edges:d.edges.filter(([a,b])=>a!==id&&b!==id)})); toast_show("Deleted."); };
  const saveLoc=()=>{ setDb(d=>({...d,locations:d.locations.map(l=>l.id===editLoc.id?{...editLoc,floor:+editLoc.floor,x:+editLoc.x,y:+editLoc.y}:l)})); setEditLoc(null); toast_show("Updated!"); };
  const addAnn=()=>{
    if(!newAnn.title.trim()){toast_show("Title required.","err");return;}
    const id=db.nextId.announcements;
    setDb(d=>({...d,announcements:[...d.announcements,{...newAnn,id,date:new Date().toISOString().slice(0,10)}],nextId:{...d.nextId,announcements:id+1}}));
    setNewAnn({title:"",body:"",priority:"normal"}); toast_show("Posted!");
  };
  const delAnn=(id)=>{ setDb(d=>({...d,announcements:d.announcements.filter(a=>a.id!==id)})); toast_show("Deleted."); };

  const pathNodes=path.map(id=>db.locations.find(l=>l.id===id)).filter(Boolean);
  const directions = useMemo(() => getDirections(path, db.locations), [path, db.locations]);
  const stepFloors = useMemo(() => {
    return path.map(id => {
      const loc = db.locations.find(l => l.id === id);
      return loc?.floor ?? 1;
    });
  }, [path, db.locations]);

  if(screen==="idle") return <KioskFrame><IdleScreen onTouch={()=>setScreen("navigate")} announcements={db.announcements}/></KioskFrame>;

  return (
    <KioskFrame>
      <div style={K.shell}>
        {/* LEFT SIDEBAR */}
        <aside style={K.sidebar}>
          <div style={K.logoBox}>
            <div style={{fontSize:28,lineHeight:1}}>🏫</div>
            <div>
              <div style={K.logoName}>ICCT</div>
              <div style={K.logoSub}>CAINTA</div>
            </div>
          </div>
          <div style={K.clock}><LiveClock/></div>
          <nav style={K.navList}>
            {[
              {key:"navigate", label:"Navigate",    icon:"🧭"},
              {key:"map",      label:"Campus Map",  icon:"🗺️"},
              {key:"qr",       label:"QR Codes",    icon:"📲"},
              {key:"announce", label:"Bulletins",   icon:"📢"},
              {key:"admin",    label:"Admin",       icon:"🔐"},
            ].map(n=>(
              <button key={n.key} onClick={()=>{setScreen(n.key);setSelNode(null);}}
                style={{...K.navBtn,...(screen===n.key?K.navBtnOn:{})}}>
                <span style={{fontSize:20}}>{n.icon}</span>
                <span style={K.navLabel}>{n.label}</span>
                {screen===n.key&&<div style={K.navIndicator}/>}
              </button>
            ))}
          </nav>
          <button onClick={()=>setScreen("idle")} style={K.idleBtn}>
            <span>⏻</span><span style={{fontSize:10,letterSpacing:1}}>STANDBY</span>
          </button>
          {session&&<div style={K.sessionBadge}>
            <span style={{fontSize:9,color:"#34d399",letterSpacing:1}}>ADMIN ACTIVE</span>
            <button onClick={()=>{setSession(null);toast_show("Signed out.");}} style={K.signOutBtn}>Sign Out</button>
          </div>}
        </aside>

        {/* MAIN CONTENT */}
        <main style={K.content}>

          {/* ── NAVIGATE — SEARCH-FIRST UI ── */}
          {screen==="navigate"&&(
            <div style={K.panel}>
              {/* Header */}
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>🧭  Where do you want to go?</div>
                <div style={K.panelSub}>Type a room name, building, or floor · Route calculated automatically</div>
              </div>

              {/* YOU ARE HERE + SEARCH ROW */}
              <div style={{ display:"flex", gap:10, flexShrink:0, alignItems:"stretch" }}>
                {/* Fixed start badge */}
                <div style={{
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  gap:3, padding:"8px 14px",
                  background:"#020e1f", border:"1.5px solid #0ea5e9",
                  borderRadius:10, flexShrink:0,
                  boxShadow:"0 0 16px rgba(14,165,233,0.15)",
                }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span style={{ color:"#0ea5e9", fontSize:8, fontWeight:800, fontFamily:"monospace", letterSpacing:1.5 }}>YOU ARE HERE</span>
                  <span style={{ color:"#1e3a5f", fontSize:8, fontFamily:"monospace", textAlign:"center", lineHeight:1.3 }}>Kiosk · Elevator Lobby</span>
                </div>

                {/* Arrow connector */}
                <div style={{
                  display:"flex", alignItems:"center", color:"#1e3a5f",
                  fontSize:20, flexShrink:0, paddingBottom:2,
                }}>→</div>

                {/* Search bar */}
                <DestinationSearch
                  locations={db.locations}
                  onSelect={handleDestinationSelect}
                  selectedId={toId}
                />

                {/* Clear button */}
                {(toId || path.length > 0) && (
                  <button onClick={clearNav} style={{
                    ...K.clearBtn, flexShrink:0, alignSelf:"stretch",
                    display:"flex", alignItems:"center", padding:"0 14px",
                  }}>✕ Clear</button>
                )}
              </div>
              
                {/* Floor selector — always visible */}
                <div style={{display:"flex", gap:6, flexShrink:0, alignItems:"center"}}>
                  <span style={{color:"#1e3a5f", fontSize:9, fontFamily:"monospace", letterSpacing:1, marginRight:4}}>VIEW FLOOR:</span>
                  {[1, 2, 3, 4].map(f => (
                    <button key={f} onClick={() => setVisibleFloor(f)}
                      style={{
                        background: visibleFloor===f ? "#1d4ed8" : "#070d1a",
                        border: `1px solid ${visibleFloor===f ? "#3b82f6" : "#0f2040"}`,
                        color: visibleFloor===f ? "#fff" : "#475569",
                        padding: "4px 12px", borderRadius: 6, cursor: "pointer",
                        fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                      }}>FL.{f}</button>
                  ))}
                </div>

              {/* Map + directions */}
              <div style={{flex:1,display:"flex",gap:12,minHeight:0,overflow:"hidden"}}>
                {/* Map */}
                <div style={{flex:"0 0 80%",minWidth:0,overflow:"hidden"}}>
                  <CampusMap locs={db.locations} edges={db.edges} path={path} onNode={handleNode} fromId={fromId}
                    toId={toId} visibleFloor={visibleFloor} navStep={navStep} navStarted={navStarted}/>
                </div>

                {/* Route / prompt panel */}
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,minWidth:0,overflow:"hidden"}}>
                  {!toId ? (
                    /* No destination yet — show suggestions */
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                      <div style={{
                        color:"#1e3a5f", fontSize:9, fontFamily:"monospace",
                        letterSpacing:2, fontWeight:800, marginBottom:2,
                      }}>QUICK ACCESS</div>
                      {[
                        { label:"Library", type:"library" },
                        { label:"Clinic", type:"clinic" },
                        { label:"Registrar", type:"Registrar" },
                        { label:"Admission Office", type:"office" },
                      ].map(suggestion => {
                        const match = db.locations.find(l =>
                          l.name.toLowerCase().includes(suggestion.label.toLowerCase()) &&
                          l.id !== KIOSK_NODE_ID
                        );
                        if (!match) return null;
                        const meta = TYPE_META[match.type?.toLowerCase()] || { color:"#94a3b8", icon:"📍" };
                        return (
                          <button key={suggestion.label} onClick={() => handleDestinationSelect(match.id)}
                            style={{
                              display:"flex", alignItems:"center", gap:10,
                              padding:"10px 12px",
                              background:"#070d1a", border:"1px solid #0f2040",
                              borderRadius:8, cursor:"pointer",
                              transition:"border-color 0.12s",
                              width:"100%", textAlign:"left",
                            }}
                            onMouseEnter={e=>e.currentTarget.style.borderColor="#1e3a5f"}
                            onMouseLeave={e=>e.currentTarget.style.borderColor="#0f2040"}
                          >
                            <span style={{fontSize:18,flexShrink:0}}>{meta.icon}</span>
                            <div>
                              <div style={{color:"#f1f5f9",fontSize:12,fontWeight:700}}>{match.name}</div>
                              <div style={{color:"#334155",fontSize:10,fontFamily:"monospace",marginTop:1}}>Floor {match.floor} · {match.type}</div>
                            </div>
                            <span style={{marginLeft:"auto",color:"#1e3a5f",fontSize:16}}>›</span>
                          </button>
                        );
                      })}
                      <div style={{
                        marginTop:"auto", padding:"10px 12px",
                        background:"#040b18", border:"1px dashed #0a1628",
                        borderRadius:8, textAlign:"center",
                      }}>
                        <div style={{color:"#0f2040",fontSize:10,fontFamily:"monospace",lineHeight:1.6}}>
                          TAP A QUICK ACCESS SHORTCUT<br/>OR USE THE SEARCH BAR ABOVE
                        </div>
                      </div>
                    </div>
                  ) : path.length === 0 ? (
                    <div style={K.emptyRoute}>
                      <div style={{fontSize:32}}>⚠️</div>
                      <div style={{color:"#334155",fontSize:12,fontFamily:"monospace",textAlign:"center"}}>No connected path<br/>found to this location.</div>
                    </div>
                  ) : !navStarted ? (
                    /* ── ROUTE PREVIEW + START BUTTON ── */
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,alignItems:"center",justifyContent:"center"}}>
                      {/* Destination card */}
                      {(() => {
                        const dest = db.locations.find(l => l.id === toId);
                        const meta = TYPE_META[dest?.type?.toLowerCase()] || { color:"#94a3b8", icon:"📍" };
                        return (
                          <div style={{
                            width:"100%", background:"#070d1a",
                            border:"1px solid #0f2040", borderRadius:10, padding:"14px 16px",
                            display:"flex", flexDirection:"column", gap:6,
                          }}>
                            <div style={{color:"#1e3a5f",fontSize:9,fontFamily:"monospace",letterSpacing:2,fontWeight:800}}>DESTINATION</div>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontSize:24}}>{meta.icon}</span>
                              <div>
                                <div style={{color:"#f1f5f9",fontWeight:800,fontSize:13,lineHeight:1.3}}>{dest?.name}</div>
                                <div style={{color:"#475569",fontSize:10,fontFamily:"monospace",marginTop:2}}>Floor {dest?.floor} · {dest?.type}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Route summary */}
                      <div style={{
                        width:"100%", background:"#040b18",
                        border:"1px solid #0a1628", borderRadius:8, padding:"10px 14px",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                      }}>
                        <div style={{display:"flex",flexDirection:"column",gap:2}}>
                          <span style={{color:"#1e3a5f",fontSize:8,fontFamily:"monospace",letterSpacing:2}}>TOTAL STOPS</span>
                          <span style={{color:"#38bdf8",fontSize:20,fontWeight:900,fontFamily:"monospace"}}>{pathNodes.length}</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"center"}}>
                          <span style={{color:"#1e3a5f",fontSize:8,fontFamily:"monospace",letterSpacing:2}}>ALGORITHM</span>
                          <span style={{color:"#334155",fontSize:10,fontFamily:"monospace",fontWeight:800}}>A* OPTIMAL</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}>
                          <span style={{color:"#1e3a5f",fontSize:8,fontFamily:"monospace",letterSpacing:2}}>STEPS</span>
                          <span style={{color:"#38bdf8",fontSize:20,fontWeight:900,fontFamily:"monospace"}}>{directions.length}</span>
                        </div>
                      </div>

                      {/* START button */}
                      <button
                        onClick={() => { setNavStarted(true); setNavStep(0); if(stepFloors[0]) setVisibleFloor(stepFloors[0]); }}
                        style={{
                          width:"100%", padding:"14px 0",
                          background:"linear-gradient(90deg,#16a34a,#15803d)",
                          border:"none", borderRadius:10, cursor:"pointer",
                          color:"#fff", fontSize:15, fontWeight:900,
                          letterSpacing:2, fontFamily:"monospace",
                          boxShadow:"0 0 24px rgba(34,197,94,0.35)",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                          transition:"box-shadow 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow="0 0 40px rgba(34,197,94,0.6)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow="0 0 24px rgba(34,197,94,0.35)"}
                      >
                        <span style={{fontSize:20}}>▶</span>
                        START NAVIGATION
                      </button>

                      <div style={{color:"#0f2040",fontSize:9,fontFamily:"monospace",letterSpacing:1,textAlign:"center"}}>
                        ROUTE READY · TAP START TO BEGIN
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={K.routeHdr}>
                        <span style={{color:"#38bdf8",fontWeight:800,fontSize:12,fontFamily:"monospace"}}>ROUTE · {pathNodes.length} STOPS</span>
                        <span style={{color:"#1e3a5f",fontSize:10,fontFamily:"monospace"}}>A* OPTIMAL PATH</span>
                      </div>
                      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                        {directions.map((dir, i) => (
                          <div key={i} onClick={() => {
                            setNavStep(i);
                            if (stepFloors[i]) setVisibleFloor(stepFloors[i]);
                            triggerFloorTransitionIfNeeded(i, directions, db.locations, path);
                          }}
                            style={{...K.stepRow,...(navStep===i?K.stepRowOn:{})}}>
                            <div style={{
                              width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",
                              justifyContent:"center",fontSize:16,flexShrink:0,
                              background:i===0?"#166534":i===directions.length-1?"#7f1d1d":"#0a1f35",
                              border:`1px solid ${i===0?"#22c55e":i===directions.length-1?"#ef4444":"#1e3a5f"}`,
                            }}>
                              {dir.icon}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{color:"#f1f5f9",fontWeight:700,fontSize:12,lineHeight:1.3}}>{dir.text}</div>
                              <div style={{color:"#475569",fontSize:10,fontFamily:"monospace",marginTop:2}}>{dir.sub}</div>
                            </div>
                            {i===0&&<span style={{color:"#22c55e",fontSize:9,fontWeight:800,flexShrink:0}}>START</span>}
                            {i===directions.length-1&&<span style={{color:"#ef4444",fontSize:9,fontWeight:800,flexShrink:0}}>END</span>}
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button disabled={navStep===0} onClick={() => {
                          const s = navStep - 1;
                          setNavStep(s);
                          if (stepFloors[s]) setVisibleFloor(stepFloors[s]);
                          triggerFloorTransitionIfNeeded(s, directions, db.locations, path);
                        }} style={K.stepBtn}>◀ Prev</button>
                        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#334155",fontSize:11,fontFamily:"monospace"}}>
                          {navStep+1} / {directions.length}
                        </div>
                        <button disabled={navStep===directions.length-1} onClick={() => {
                          const s = navStep + 1;
                          setNavStep(s);
                          if (stepFloors[s]) setVisibleFloor(stepFloors[s]);
                          triggerFloorTransitionIfNeeded(s, directions, db.locations, path);
                        }} style={K.stepBtn}>Next ▶</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── MAP ── */}
          {screen==="map"&&(
            <div style={K.panel}>
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>🗺️  Campus Map</div>
                <div style={K.panelSub}>Tap any node to view room details · ICCT Cainta Draft Layout</div>
              </div>
              <div style={{display:"flex", gap:6, flexShrink:0}}>
                {[1, 2, 3, 4, 5, 6, 7].map(f => (
                  <button key={f} onClick={() => setVisibleFloor(f)}
                    style={{
                      background: visibleFloor===f ? "#1d4ed8" : "#070d1a",
                      border: `1px solid ${visibleFloor===f ? "#3b82f6" : "#0f2040"}`,
                      color: visibleFloor===f ? "#fff" : "#475569",
                      padding: "5px 14px", borderRadius: 6, cursor: "pointer",
                      fontSize: 11, fontFamily: "monospace", fontWeight: 700
                    }}>
                    FL. {f}
                  </button>
                ))}
              </div>
              <div style={{flex:1,display:"flex",gap:12,minHeight:0}}>
                <div style={{flex:1,minWidth:0}}>
                  <CampusMap locs={db.locations} edges={db.edges} path={[]} onNode={handleNode} fromId={null} toId={null} visibleFloor={visibleFloor}/>
                </div>
                <div style={K.mapSide}>
                  <div style={K.legendTitle}>ROOM TYPES</div>
                  {Object.entries(TYPE_META).map(([t,m])=>(
                    <div key={t} style={K.legendRow}>
                      <span>{m.icon}</span>
                      <span style={{color:m.color,fontSize:11,fontFamily:"monospace",textTransform:"capitalize"}}>{t}</span>
                    </div>
                  ))}
                  {selNode&&(
                    <div style={K.nodeCard}>
                      <div style={{color:TYPE_META[selNode.type]?.color||"#94a3b8",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:4}}>{selNode.type.toUpperCase()} · FL.{selNode.floor}</div>
                      <div style={{color:"#f1f5f9",fontWeight:800,fontSize:14,marginBottom:6,lineHeight:1.3}}>{selNode.name}</div>
                      <div style={{color:"#94a3b8",fontSize:11,marginBottom:10}}>{selNode.desc}</div>
                      <button onClick={()=>{setScreen("navigate");handleDestinationSelect(selNode.id);setSelNode(null);}} style={K.miniBtn}>🧭 Navigate Here</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── QR ── */}
          {screen==="qr"&&(
            <div style={K.panel}>
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>📲  QR Code Directory</div>
                <div style={K.panelSub}>Scan any code with your phone to open mobile navigation</div>
              </div>
              <div style={{flex:1,display:"flex",gap:12,minHeight:0,overflow:"hidden"}}>
                <div style={{flex:"0 0 38%",display:"flex",flexDirection:"column",gap:4,overflowY:"auto"}}>
                  {db.locations.map(loc=>(
                    <button key={loc.id} onClick={()=>setQrLoc(loc)}
                      style={{...K.qrListItem,...(qrLoc?.id===loc.id?K.qrListItemOn:{})}}>
                      <span style={{fontSize:16}}>{TYPE_META[loc.type]?.icon||"📍"}</span>
                      <div style={{textAlign:"left",minWidth:0}}>
                        <div style={{color:"#f1f5f9",fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{loc.name}</div>
                        <div style={{color:"#475569",fontSize:10,fontFamily:"monospace"}}>Floor {loc.floor} · #{loc.id}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
                  {qrLoc?(
                    <>
                      <div style={K.qrBig}><QRCode text={qrLoc.qr} size={160}/></div>
                      <div style={{textAlign:"center"}}>
                        <div style={{color:TYPE_META[qrLoc.type]?.color||"#94a3b8",fontSize:11,fontWeight:800,letterSpacing:2,fontFamily:"monospace",marginBottom:4}}>
                          {TYPE_META[qrLoc.type]?.icon} {qrLoc.type.toUpperCase()} · FLOOR {qrLoc.floor}
                        </div>
                        <div style={{color:"#f1f5f9",fontSize:18,fontWeight:900}}>{qrLoc.name}</div>
                        <div style={{color:"#475569",fontSize:12,margin:"6px 0"}}>{qrLoc.desc}</div>
                        <div style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:6,padding:"6px 14px",display:"inline-block",marginTop:4}}>
                          <code style={{color:"#38bdf8",fontSize:10}}>{qrLoc.qr}</code>
                        </div>
                      </div>
                    </>
                  ):(
                    <div style={{textAlign:"center",color:"#1e3a5f"}}>
                      <div style={{fontSize:48}}>📲</div>
                      <div style={{fontFamily:"monospace",fontSize:13,marginTop:8}}>Select a location</div>
                    </div>
                  )}
                </div>
                <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",gap:6,overflowY:"auto"}}>
                  {db.locations.slice(0,10).map(loc=>(
                    <div key={loc.id} onClick={()=>setQrLoc(loc)} style={{...K.qrMini,...(qrLoc?.id===loc.id?{border:"1px solid #38bdf8"}:{}),cursor:"pointer"}}>
                      <QRCode text={loc.qr} size={56}/>
                      <div style={{color:"#334155",fontSize:8,fontFamily:"monospace",textAlign:"center",marginTop:2}}>{loc.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {screen==="announce"&&(
            <div style={K.panel}>
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>📢  Campus Bulletins</div>
                <div style={K.panelSub}>Official announcements from ICCT Administration</div>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
                {db.announcements.map(a=>(
                  <div key={a.id} style={{...K.annCard,borderLeft:`4px solid ${a.priority==="high"?"#ef4444":"#1e3a5f"}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      {a.priority==="high"&&<span style={K.urgentTag}>🔴 URGENT</span>}
                      <span style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{a.date}</span>
                    </div>
                    <div style={{color:"#f1f5f9",fontSize:15,fontWeight:800,marginBottom:6}}>{a.title}</div>
                    <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.5}}>{a.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADMIN ── */}
          {screen==="admin"&&(
            !session?(
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={K.loginBox}>
                  <div style={{textAlign:"center",marginBottom:24}}>
                    <div style={{fontSize:48}}>🔐</div>
                    <div style={{color:"#f1f5f9",fontSize:20,fontWeight:900,marginTop:8}}>Admin Access</div>
                    <div style={{color:"#475569",fontSize:12,fontFamily:"monospace",marginTop:4}}>ICCT Cainta Kiosk System</div>
                  </div>
                  {loginF.err&&<div style={K.errBox}>{loginF.err}</div>}
                  <input style={K.inp} placeholder="Username" value={loginF.u} onChange={e=>setLoginF(f=>({...f,u:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
                  <input style={K.inp} type="password" placeholder="Password" value={loginF.p} onChange={e=>setLoginF(f=>({...f,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
                  <button onClick={doLogin} style={K.loginBtn}>SIGN IN</button>
                  <div style={{color:"#1e3a5f",fontSize:11,textAlign:"center",marginTop:16,fontFamily:"monospace"}}>
                    Demo: <span style={{color:"#38bdf8"}}>admin</span> / <span style={{color:"#38bdf8"}}>icct2026</span>
                  </div>
                </div>
              </div>
            ):(
              <div style={K.panel}>
                <div style={K.panelHdr}>
                  <div style={K.panelTitle}>🔐  Admin Panel</div>
                  <div style={{display:"flex",gap:6}}>
                    {["locations","announcements","users"].map(t=>(
                      <button key={t} onClick={()=>setAdminTab(t)}
                        style={{...K.tabBtn,...(adminTab===t?K.tabBtnOn:{})}}>
                        {t.charAt(0).toUpperCase()+t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
                  {adminTab==="locations"&&(
                    <>
                      <div style={K.formBox}>
                        <div style={K.formTitle}>➕ Add Location</div>
                        <div style={K.formGrid}>
                          <input style={K.inp} placeholder="Name" value={newLoc.name} onChange={e=>setNewLoc(f=>({...f,name:e.target.value}))}/>
                          <select style={K.inp} value={newLoc.type} onChange={e=>setNewLoc(f=>({...f,type:e.target.value}))}>
                            {Object.keys(TYPE_META).map(t=><option key={t}>{t}</option>)}
                          </select>
                          <input style={K.inp} type="number" placeholder="Floor" value={newLoc.floor} onChange={e=>setNewLoc(f=>({...f,floor:e.target.value}))}/>
                          <input style={K.inp} type="number" placeholder="X" value={newLoc.x} onChange={e=>setNewLoc(f=>({...f,x:e.target.value}))}/>
                          <input style={K.inp} type="number" placeholder="Y" value={newLoc.y} onChange={e=>setNewLoc(f=>({...f,y:e.target.value}))}/>
                          <input style={K.inp} placeholder="Description" value={newLoc.desc} onChange={e=>setNewLoc(f=>({...f,desc:e.target.value}))}/>
                        </div>
                        <button onClick={addLoc} style={K.addBtn}>Add Location</button>
                      </div>
                      <div style={{overflowX:"auto"}}>
                        <table style={K.tbl}>
                          <thead><tr>{["ID","Name","Type","Fl","X","Y","Actions"].map(h=><th key={h} style={K.th}>{h}</th>)}</tr></thead>
                          <tbody>
                            {db.locations.map(loc=>editLoc?.id===loc.id?(
                              <tr key={loc.id} style={{background:"#0d1f35"}}>
                                <td style={K.td}>{loc.id}</td>
                                <td style={K.td}><input style={K.inpSm} value={editLoc.name} onChange={e=>setEditLoc(f=>({...f,name:e.target.value}))}/></td>
                                <td style={K.td}><select style={K.inpSm} value={editLoc.type} onChange={e=>setEditLoc(f=>({...f,type:e.target.value}))}>{Object.keys(TYPE_META).map(t=><option key={t}>{t}</option>)}</select></td>
                                <td style={K.td}><input style={{...K.inpSm,width:40}} type="number" value={editLoc.floor} onChange={e=>setEditLoc(f=>({...f,floor:e.target.value}))}/></td>
                                <td style={K.td}><input style={{...K.inpSm,width:40}} type="number" value={editLoc.x} onChange={e=>setEditLoc(f=>({...f,x:e.target.value}))}/></td>
                                <td style={K.td}><input style={{...K.inpSm,width:40}} type="number" value={editLoc.y} onChange={e=>setEditLoc(f=>({...f,y:e.target.value}))}/></td>
                                <td style={K.td}><button onClick={saveLoc} style={K.sBtnOk}>✓</button> <button onClick={()=>setEditLoc(null)} style={K.sBtnGhost}>✕</button></td>
                              </tr>
                            ):(
                              <tr key={loc.id} style={{borderBottom:"1px solid #0f1f35"}}>
                                <td style={K.td}>{loc.id}</td>
                                <td style={K.td}><span style={{color:TYPE_META[loc.type]?.color||"#94a3b8"}}>{TYPE_META[loc.type]?.icon}</span> {loc.name}</td>
                                <td style={K.td}>{loc.type}</td>
                                <td style={K.td}>{loc.floor}</td>
                                <td style={K.td}>{loc.x}</td>
                                <td style={K.td}>{loc.y}</td>
                                <td style={K.td}>
                                  <button onClick={()=>setEditLoc({...loc})} style={K.sBtnOk}>✏️</button>{" "}
                                  <button onClick={()=>delLoc(loc.id)} style={K.sBtnDanger}>🗑️</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {adminTab==="announcements"&&(
                    <>
                      <div style={K.formBox}>
                        <div style={K.formTitle}>➕ Post Announcement</div>
                        <div style={K.formGrid}>
                          <input style={K.inp} placeholder="Title" value={newAnn.title} onChange={e=>setNewAnn(f=>({...f,title:e.target.value}))}/>
                          <select style={K.inp} value={newAnn.priority} onChange={e=>setNewAnn(f=>({...f,priority:e.target.value}))}>
                            <option value="normal">Normal</option><option value="high">High Priority</option>
                          </select>
                          <textarea style={{...K.inp,gridColumn:"1/-1",minHeight:60,resize:"vertical"}} placeholder="Message body..." value={newAnn.body} onChange={e=>setNewAnn(f=>({...f,body:e.target.value}))}/>
                        </div>
                        <button onClick={addAnn} style={K.addBtn}>Post Announcement</button>
                      </div>
                      {db.announcements.map(a=>(
                        <div key={a.id} style={{...K.annCard,position:"relative"}}>
                          <button onClick={()=>delAnn(a.id)} style={{position:"absolute",top:10,right:10,...K.sBtnDanger}}>🗑️</button>
                          <div style={{color:a.priority==="high"?"#ef4444":"#38bdf8",fontSize:10,fontWeight:800,fontFamily:"monospace",marginBottom:4}}>{a.priority.toUpperCase()} · {a.date}</div>
                          <div style={{color:"#f1f5f9",fontWeight:700,marginBottom:4}}>{a.title}</div>
                          <div style={{color:"#94a3b8",fontSize:12}}>{a.body}</div>
                        </div>
                      ))}
                    </>
                  )}
                  {adminTab==="users"&&(
                    <div>
                      <table style={K.tbl}>
                        <thead><tr>{["ID","Username","Role","Session"].map(h=><th key={h} style={K.th}>{h}</th>)}</tr></thead>
                        <tbody>
                          {db.users.map(u=>(
                            <tr key={u.id} style={{borderBottom:"1px solid #0f1f35"}}>
                              <td style={K.td}>{u.id}</td>
                              <td style={K.td}>{u.username}</td>
                              <td style={K.td}><span style={{color:u.role==="admin"?"#fbbf24":"#38bdf8",fontSize:10,fontWeight:800,background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:4,fontFamily:"monospace"}}>{u.role.toUpperCase()}</span></td>
                              <td style={K.td}><span style={{color:session?.id===u.id?"#34d399":"#334155",fontSize:10,fontFamily:"monospace"}}>{session?.id===u.id?"● ACTIVE":"○ —"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{marginTop:12,background:"#0a1220",border:"1px solid #1a2744",borderRadius:8,padding:14,fontSize:11,color:"#334155",fontFamily:"monospace",lineHeight:1.7}}>
                        🔒 SECURITY NOTE: Production deployment uses bcrypt password hashing, signed JWTs (HS256) with 1h expiry, HTTPS-only cookies, RBAC middleware, rate limiting on login endpoint, and audit logging.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

        </main>
      </div>

      {toast&&<div style={{...K.toast,background:toast.type==="err"?"#450a0a":"#052e16",borderColor:toast.type==="err"?"#ef4444":"#22c55e",color:toast.type==="err"?"#fca5a5":"#bbf7d0"}}>{toast.msg}</div>}
      <FloorTransitionOverlay data={floorTransition} onDone={() => setFloorTransition(null)}/>
    </KioskFrame>
  );
}

/* ── LIVE CLOCK ── */
function LiveClock(){
  const [t,setT]=useState(new Date());
  useEffect(()=>{ const i=setInterval(()=>setT(new Date()),1000); return()=>clearInterval(i); },[]);
  return (
    <div style={{textAlign:"center"}}>
      <div style={{color:"#f1f5f9",fontSize:22,fontWeight:800,fontFamily:"'Courier New',monospace",letterSpacing:3,lineHeight:1}}>
        {t.getHours().toString().padStart(2,"0")}:{t.getMinutes().toString().padStart(2,"0")}
      </div>
      <div style={{color:"#1e3a5f",fontSize:9,fontFamily:"monospace",letterSpacing:1,marginTop:2}}>
        {["SUN","MON","TUE","WED","THU","FRI","SAT"][t.getDay()]} {t.getDate()}/{t.getMonth()+1}
      </div>
    </div>
  );
}

/* ── KIOSK FRAME ── */
function KioskFrame({children}){
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const scale = Math.min(size.w / 1366, size.h / 768);
  const ml = (size.w - 1366 * scale) / 2;
  const mt = (size.h - 768 * scale) / 2;
  return (
    <div style={{width:"100vw",height:"100vh",background:"#000",overflow:"hidden",position:"relative"}}>
      <div style={{width:1366,height:768,position:"absolute",overflow:"hidden",background:"#020917",transform:`scale(${scale})`,transformOrigin:"top left",left:ml,top:mt}}>
        {children}
      </div>
    </div>
  );
}

/* ── KIOSK STYLES ── */
const K = {
  shell:       { width:1366, height:768, display:"flex", overflow:"hidden", fontFamily:"'Segoe UI',system-ui,sans-serif" },
  sidebar:     { width:156, background:"#030e1e", borderRight:"1px solid #0a1f35", display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", gap:8, flexShrink:0 },
  logoBox:     { display:"flex", alignItems:"center", gap:8, padding:"0 12px", width:"100%" },
  logoName:    { color:"#f1f5f9", fontSize:16, fontWeight:900, letterSpacing:1 },
  logoSub:     { color:"#1e3a5f", fontSize:9, fontFamily:"monospace", letterSpacing:2 },
  clock:       { padding:"8px 0", width:"100%", borderTop:"1px solid #0a1f35", borderBottom:"1px solid #0a1f35", margin:"4px 0" },
  navList:     { display:"flex", flexDirection:"column", gap:2, width:"100%", flex:1 },
  navBtn:      { display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 8px", background:"transparent", border:"none", cursor:"pointer", position:"relative", width:"100%", transition:"background .15s" },
  navBtnOn:    { background:"#0a1f35" },
  navLabel:    { color:"#475569", fontSize:10, fontFamily:"monospace", letterSpacing:.5 },
  navIndicator:{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", width:3, height:28, background:"#38bdf8", borderRadius:"2px 0 0 2px" },
  idleBtn:     { display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px", background:"transparent", border:"1px solid #0a1f35", borderRadius:8, cursor:"pointer", color:"#1e3a5f", width:"80%", fontSize:18, marginTop:"auto" },
  sessionBadge:{ width:"80%", background:"#022c1a", border:"1px solid #064e2a", borderRadius:6, padding:"6px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  signOutBtn:  { background:"transparent", border:"none", color:"#374151", fontSize:10, cursor:"pointer", fontFamily:"monospace" },
  content:     { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#040d1a" },
  panel:       { flex:1, display:"flex", flexDirection:"column", gap:10, padding:16, overflow:"hidden" },
  panelHdr:    { display:"flex", justifyContent:"space-between", alignItems:"baseline", flexShrink:0 },
  panelTitle:  { color:"#f1f5f9", fontSize:16, fontWeight:800, letterSpacing:.5 },
  panelSub:    { color:"#1e3a5f", fontSize:10, fontFamily:"monospace" },
  mapSide:     { width:160, display:"flex", flexDirection:"column", gap:4, overflowY:"auto", flexShrink:0 },
  legendTitle: { color:"#1e3a5f", fontSize:9, fontFamily:"monospace", letterSpacing:2, fontWeight:800, marginBottom:4 },
  legendRow:   { display:"flex", alignItems:"center", gap:6, padding:"2px 0" },
  nodeCard:    { background:"#070d1a", border:"1px solid #0f2040", borderRadius:8, padding:10, marginTop:8 },
  miniBtn:     { background:"#0a1f35", border:"1px solid #1e3a5f", color:"#38bdf8", padding:"5px 10px", borderRadius:6, cursor:"pointer", fontSize:10, fontFamily:"monospace", width:"100%" },
  sel:         { flex:1, background:"#070d1a", border:"1px solid #0f2040", color:"#94a3b8", padding:"6px 10px", borderRadius:6, fontSize:11, fontFamily:"monospace" },
  goBtn:       { background:"#1d4ed8", border:"none", color:"#fff", padding:"6px 18px", borderRadius:6, cursor:"pointer", fontWeight:800, fontSize:13 },
  clearBtn:    { background:"#1a0505", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:12 },
  emptyRoute:  { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, border:"1px dashed #0f2040", borderRadius:10 },
  routeHdr:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", background:"#070d1a", borderRadius:6, border:"1px solid #0f2040", flexShrink:0 },
  stepRow:     { display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:6, cursor:"pointer", border:"1px solid transparent", transition:"all .1s" },
  stepRowOn:   { background:"#0a1f35", border:"1px solid #1e3a5f" },
  stepBtn:     { background:"#070d1a", border:"1px solid #0f2040", color:"#475569", padding:"5px 14px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"monospace" },
  qrListItem:  { display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#070d1a", border:"1px solid #0f2040", borderRadius:7, cursor:"pointer", transition:"all .1s", width:"100%" },
  qrListItemOn:{ background:"#0a1f35", border:"1px solid #1e3a5f" },
  qrBig:       { padding:12, background:"#fff", borderRadius:10, boxShadow:"0 0 40px #0ea5e940" },
  qrMini:      { padding:6, background:"#070d1a", border:"1px solid #0f2040", borderRadius:6 },
  annCard:     { background:"#070d1a", border:"1px solid #0f2040", borderRadius:8, padding:14 },
  urgentTag:   { background:"#450a0a", color:"#fca5a5", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:4, fontFamily:"monospace", letterSpacing:1 },
  loginBox:    { background:"#070d1a", border:"1px solid #0f2040", borderRadius:16, padding:36, width:320, display:"flex", flexDirection:"column", gap:12 },
  errBox:      { background:"#450a0a", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"8px 12px", borderRadius:6, fontSize:12 },
  inp:         { background:"#030e1e", border:"1px solid #0f2040", color:"#f1f5f9", padding:"8px 12px", borderRadius:6, fontSize:12, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box" },
  inpSm:       { background:"#030e1e", border:"1px solid #0f2040", color:"#f1f5f9", padding:"3px 6px", borderRadius:4, fontSize:11, fontFamily:"inherit", width:80 },
  loginBtn:    { background:"linear-gradient(90deg,#1d4ed8,#4f46e5)", border:"none", color:"#fff", padding:"11px", borderRadius:8, cursor:"pointer", fontWeight:800, fontSize:14, letterSpacing:1, fontFamily:"monospace" },
  formBox:     { background:"#070d1a", border:"1px solid #0f2040", borderRadius:10, padding:14, flexShrink:0 },
  formTitle:   { color:"#334155", fontSize:12, fontWeight:700, marginBottom:10, fontFamily:"monospace" },
  formGrid:    { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 },
  addBtn:      { background:"#1d4ed8", border:"none", color:"#fff", padding:"7px 18px", borderRadius:6, cursor:"pointer", fontWeight:700, fontSize:12 },
  tbl:         { width:"100%", borderCollapse:"collapse", fontSize:11, fontFamily:"monospace" },
  th:          { background:"#070d1a", color:"#334155", padding:"7px 10px", textAlign:"left", borderBottom:"1px solid #0f2040", fontWeight:800, letterSpacing:1 },
  td:          { padding:"6px 10px", color:"#94a3b8", verticalAlign:"middle" },
  tabBtn:      { background:"transparent", border:"1px solid #0f2040", color:"#334155", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"monospace" },
  tabBtnOn:    { background:"#0a1f35", border:"1px solid #1e3a5f", color:"#38bdf8", fontWeight:700 },
  sBtnOk:      { background:"#0a1f35", border:"1px solid #1e3a5f", color:"#93c5fd", padding:"3px 8px", borderRadius:4, cursor:"pointer", fontSize:11 },
  sBtnGhost:   { background:"transparent", border:"1px solid #1e293b", color:"#475569", padding:"3px 8px", borderRadius:4, cursor:"pointer", fontSize:11 },
  sBtnDanger:  { background:"#450a0a", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"3px 8px", borderRadius:4, cursor:"pointer", fontSize:11 },
  toast:       { position:"fixed", bottom:20, right:20, padding:"10px 20px", borderRadius:8, border:"1px solid", fontSize:12, fontWeight:700, fontFamily:"monospace", zIndex:9999, boxShadow:"0 8px 32px #00000088" },
};