

import snmp from 'net-snmp';

const session = snmp.createSession("192.168.1.2", "public");

const oids = [
    "1.3.6.1.2.1.1.1.0", 
    "1.3.6.1.2.1.1.3.0", 
    "1.3.6.1.2.1.1.5.0"  
];

session.get(oids, (error, varbinds) => {
    if (error) {
        console.error("error" , error);
    } else {
        console.log("start");
        varbinds.forEach((vb) => {
            console.log("print vb" , vb);
            console.log(`${vb.oid} = ${vb.value}`);
        });
    }
    session.close();
});




























// THIS IS FINAL 

// import snmp from 'net-snmp';

// const session = snmp.createSession("192.168.1.7", "public");

// const oids = [
//     "1.3.6.1.2.1.1.1.0", 
//     "1.3.6.1.2.1.1.3.0", 
//     "1.3.6.1.2.1.1.5.0" ,
//     "1.3.6.1.2.1.1.3.0"
// ];

// session.get(oids, (error, varbinds) => {
//     if (error) {
//         console.error("error" , error);
//     } else {
//         console.log("start");
//         varbinds.forEach((vb) => {
//             console.log("print vb" , vb);
//             console.log(`${vb.oid} = ${vb.value}`);
//         });
//     }
//     session.close();
// });



// THIS IS PREVIOUS 
// import snmp from 'net-snmp';

// const switchIP = "192.168.1.70";  
// const community = "public";  

// const oids = [
//     "1.3.6.1.2.1.1.5.0",  
//     "1.3.6.1.2.1.1.3.0",  
//     "1.3.6.1.2.1.2.2.1.8.1", 
//     "1.3.6.1.2.1.31.1.1.1.6.1", 
//     "1.3.6.1.2.1.31.1.1.1.10.1" 
// ];

// const session = snmp.createSession(switchIP, community);

// function fetchSNMPData() {
//     console.log("start");
//     session.get(oids, function (error, varbinds) {
//         if (error) {
//             console.error("SNMP Error: ", error);
//         } else {
//             console.log("\n--- Switch Monitoring Data ---");
//             varbinds.forEach(v => {
//                 console.log(`${v.oid} = ${v.value.toString()}`);
//             });
//         }
//         session.close();
//     });
// }

// fetchSNMPData();



