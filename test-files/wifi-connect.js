var wifi = require("node-wifi");

id = "2718_APT2_5";
pass = "password2";

wifi.init({ iface: null });

wifi.connect({ ssid: id, password: pass }, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected");
    }
});
