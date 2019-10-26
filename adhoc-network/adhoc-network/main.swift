//
//  main.swift
//  adhoc-network
//
//  Created by Johnathan Chiu on 10/16/19.
//  Copyright © 2019 Johnathan Chiu. All rights reserved.
//

import Foundation
import CoreWLAN

let args = CommandLine.arguments
if args.count < 3 {
    let p = args[0].components(separatedBy: "/")

    print("Usage: \(p.last!) <SSID> <Password>")
    exit(64)
}

let networkName = args[1]
let password = args[2]

if let iface = CWWiFiClient.shared().interface() {
    do {
        try iface.startIBSSMode(
            withSSID: networkName.data(using: String.Encoding.utf8)!,
            security: CWIBSSModeSecurity.WEP104,
            channel: 11,
            password: password as String)
        print("Success")
    } catch let error as NSError {
        print("Error", error)
        exit(1)
    }
} else {
    print("Invalid interface")
    exit(1)
}
