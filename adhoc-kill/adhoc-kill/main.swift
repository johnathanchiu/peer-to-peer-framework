//
//  main.swift
//  adhoc-kill
//
//  Created by Johnathan Chiu on 10/17/19.
//  Copyright © 2019 Johnathan Chiu. All rights reserved.
//

import Foundation
import CoreWLAN

CWWiFiClient.shared().interface()?.disassociate()


