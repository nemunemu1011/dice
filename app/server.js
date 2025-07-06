const { ReadableStream } = require("fetch-ponyfill");
global.ReadableStream =
ReadableStream;
const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, ChannelType } = require('discord.js');
var MersenneTwister = require('mersenne-twister');
var mt = new MersenneTwister();

const client = new Client({
    intents: [GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel],
    shards: "auto"
});

const { ActivityType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

client.on("ready", (message) => {
    console.log("Ready!");
    client.user.setPresence({
        activities: [{ name: "bothelp", type: ActivityType.Playing }],
        status: "idle",
    });
});

http
    .createServer(function (req, res) {
        if (req.method == "POST") {
            var data = "";
            req.on("data", function (chunk) {
                data += chunk;
            });
            req.on("end", function () {
                if (!data) {
                    res.end("No post data");
                    return;
                }
                var dataObject = querystring.parse(data);
                console.log("post:" + dataObject.type);
                if (dataObject.type == "wake") {
                    console.log("Woke up in post");
                    res.end();
                    return;
                }
                res.end();
            });
        } else if (req.method == "GET") {
            
        }
    })
    .listen(3000);

client.on("ready", (message) => {
    console.log("Bot準備完了～!");
});

client.on("messageCreate", async (message) => {
    if ((message.author.id == client.user.id || message.author.bot) || (/^[Dd\uFF24\uFF44]4[Dd\uFF24\uFF44][Jj\uFF2A\uFF4A]/.test(message.content))) {
        return;
    }

    if (message.content.match(/にゃーん$|にゃ〜ん$/)) {
        message.channel.send("にゃ〜ん");
        return;
    }
    if (message.content.match(/よくできました|良くできました|よく出来ました|良く出来ました|おもろいな/)) {
        message.channel.send("えへへ");
        return;
    }
    if (message.content.match(/^パンダ$|^ぱんだ$/)) {
        message.react("🐼");
        return;
    }
    if (message.content.match(/^にゃん$/)) {
        message.channel.send("にゃ〜:black_cat:");
    }
    if (message.content.match(/^わん$|^わんわん$|^ワン$|^ワンワン$/)) {
        var text;
        if (mt.random() < 0.5) {
            text = "🐶<ﾜﾝﾜﾝ";
        }
        else {
            text = "🐶<ｸｩﾝ";
        }
        message.channel.send(text);
    }
    if (message.content.match(/いい子だ下僕よ$|良い子だ下僕よ$/)) {
        message.channel.send("ありがとにゃ～ん");
        return;
    }
    if (message.content.match(/^ping$|^Ping$/)) {
        message.channel.send(
            "I'm in " +
            client.guilds.cache.size +
            "severs!\nPing:" +
            Math.round(client.ws.ping) +
            "ms!"
        );
        client.user.setPresence({
            activities: [{ name: "bothelp", type: ActivityType.Playing }],
            status: "online",
        });
    }

    if (message.content.match(/^bothelp[ 　]all/)) {
        message.channel.send({ embeds: [helpall] });
    } else if (message.content.startsWith("bothelp")) {



        const reply = await message.channel.send({
            embeds: [help1],
            components: [new discord.ActionRowBuilder().addComponents(page1, page2, page3, allpage)],
        });
        setTimeout(() => reply.edit({ components: [] }), 30000);
    }

    if (message.content.match(/^shuffle[ 　,]|^ff[ 　,]/)) {
        var getDiceString = message.content;
        var arr = getDiceString.split(/ |　|,/);
        var tmp = arr.shift();

        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(mt.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        arr = arr.toString();
        say("shuffle", arr);
    }

    if (message.content.match(/^choice[ 　\d,]/) || message.content.match(/^cc[ 　\d,]/)) {

        var getDiceString = message.content;
        var arr = getDiceString.split(/ |　|,/);

        if (/\d+/.test(arr[0])) {
            var num = arr[0].match(/\d+/);

            if (parseInt(num) <= arr.length - 1) {
                var tmp = arr.shift();

                for (var i = arr.length - 1; i > 0; i--) {
                    var j = Math.floor(mt.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }

                var len = arr.length;
                for (var i = 0; i < len - parseInt(num); i++) {
                    tmp = arr.shift();
                }

                arr = arr.toString();
                say("choice", arr);
            } else {
                message.channel.send("あほったれ！！！！");
            }
        } else {
            var tmp = arr.shift();

            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(mt.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }

            var ans = arr[0].toString();
            say("choice", ans);
        }
    }

    if (message.content.match(/^choicex[ 　\d,]/) || message.content.match(/^ccx[ 　\d,]/)) {

        var getDiceString = message.content;
        var arr = getDiceString.split(/ |　|,/);

        if (/\d+/.test(arr[0])) {
            var num = arr[0].match(/\d+/);
            arr.shift();
            var rand;
            var result = [];
            for (var i = 0; i < num; i++) {
                rand = Math.floor((mt.random() * 10000000) % (arr.length));
                result.push(arr[rand]);
            }

            result = result.toString();
            say("choice(重複あり)", result);

        } else {
            var tmp = arr.shift();

            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(mt.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }

            say("choice", arr[0]);
        }
    }


    if (message.content.match(/^exp[ 　]\d*[dD\uFF24\uFF44]\d+/)) {
        var input = message.content;
        var tmp = input.split(/[ 　]/);
        var nums = tmp[1].split(/[^\d]/);
        var exp = (nums[0] * (parseInt(nums[1]) + 1)) / 2;
        say(tmp[1].replace(/[^dｄD\uFF440-9]/, ""), "-->期待値" + exp.toFixed(1));
    }

    if (message.content.match(/^(s|S|ｓ)?(?:dd|ささ|笹|ｄｄ)(?:$| |　|\d+)/)) {
        //クイックダイス

        var dice;
        var random = null;
        var tmpVa = [];
        var total;
        var result;
        var getDiceString = message.content;
        var sec = 0;
        if (/^(s|S|ｓ)/.test(getDiceString)) {
            sec = 1;
            getDiceString = getDiceString.substr(1);
        }
        var suc = getDiceString.match(/\d+/);

        dice = "1d100";
        random = Math.floor(((mt.random() * 10000000) % 100) + 1);

        if (random <=5) {
            //CoCのクリティカル処理
            result = random + "-->決定的成功(クリティカル)！";
        } else if (random >= 96) {
            //CoCのファンブル処理
            result = random + "-->致命的失敗(ファンブル)";
        } else if (/\d+/.test(suc)) {
            if (suc >= random) {
                result = random + "-->成功";
            } else {
                result = random + "-->失敗";
            }
        } else {
            result = random;
        }

        say(dice, "-->" + result, sec);

    } else if (message.content.match(/^(s|S|ｓ)?(?:ss|なな|七|ｓｓ)(?:$| |　|\d+)/)) {
        //シノビガミ用クイックダイス

        var dice;
        var random = null;
        var tmpVa = [];
        var total;
        var result;
        var getDiceString = message.content;
        var sec = 0;
        if (/^(s|S|ｓ){3}/.test(getDiceString)) {
            sec = 1;
            getDiceString = getDiceString.substr(1);
        }
        var suc = getDiceString.match(/\d+/);

        dice = "2d6";
        for (var i = 0; i < 2; i++) {
            random = Math.floor(((mt.random() * 10000000) % 6) + 1);
            tmpVa.push(random);
        }
        total = tmpVa.reduce((sum, element) => sum + element, 0);

        if (total == 12) {
            //シノビガミのスペシャル処理
            result = tmpVa + "-->合計" + total + "-->スペシャル！";
        } else if (total == 2) {
            //シノビガミのファンブル処理
            result = tmpVa + "-->合計" + total + "-->致命的失敗";
        } else if (/\d+/.test(suc)) {
            if (suc <= total) {
                result = tmpVa + "-->合計" + total + "-->成功";
            } else {
                result = tmpVa + "-->合計" + total + "-->失敗";
            }
        } else {
            result = tmpVa + "-->合計" + total;
        }

        say(dice, "-->" + result, sec);
    }




    //+処理
    else if (/^(s|S|ｓ)?[dｄ0-9]/.test(message.content) & /d|ｄ|D/.test(message.content) & /\d/.test(message.content) & /\+|＋/.test(message.content)  /*&!/[^dｄ0-9\+＋ 　]/.test(message.content)*/) {


        try {
            if (/b/.test(message.content)) {
                message.channel.send("バラバラダイスと通常ダイスが混ざってるで〜");
                return;
            }

            var getDiceString = message.content;
            var sec = 0;
            if (/^(s|S|ｓ)/.test(getDiceString)) {
                sec = 1;
                getDiceString = getDiceString.substr(1);
            }
            var tm = getDiceString.replace(/[^dｄD0-9\+＋]/g, "");
            var input = tm.split(/\+|＋/);
            var result = []; //結果の格納配列
            var sum = 0;
            var ans = "";
            for (var i = 0; i < input.length; i++) {

                if (input[i].match(/\d+[dD\uFF24\uFF44]{1,2}\d+/)) {
                    //1d3型

                    var prefix = input[i].split(/[^\d]/); //prefix[0]がダイス数、prefix[1]がダイスの面の数
                    prefix = prefix.filter(Boolean);
                    var random = null; //個々の出目に対応
                    var tmpVa = []; //ここでのダイスの合計値の格納

                    for (var j = 0; j < parseInt(prefix[0]); j++) {
                        //振る
                        random = Math.floor(((mt.random() * 10000000) % parseInt(prefix[1])) + 1);
                        tmpVa.push(random);
                    }
                    if (input[i].match(/[dD\uFF24\uFF44]{2}/)) {
                        tmpVa.sort(compareFunc);
                    }

                    //result,sumに追加
                    if (prefix[0] == 1) {
                        result.push(tmpVa[0]);
                        sum = sum + parseInt(tmpVa[0]);
                    } else {
                        let total = tmpVa.reduce((sum, element) => sum + element, 0);
                        result.push(total + "[" + tmpVa.toString() + "]");
                        sum = sum + total;
                    }
                } else if (input[i].match(/^[dD\uFF24\uFF44]\d+/)) {
                    //d3型
                    var prefix = input[i].match(/\d+/);
                    var random = Math.floor(((mt.random() * 10000000) % prefix) + 1);
                    result.push(random);
                    sum = sum + random;
                } else if (input[i].match(/\d+/)) {
                    //ただの数字
                    var num = input[i].match(/\d+/);
                    result.push(num);
                    sum = sum + parseInt(num);
                }
            }

            for (var i = 0; i < result.length; i++) {
                ans = ans + "+" + result[i];
            }
            ans = ans.slice(1);
            say(message.content.replace(/[^dｄD\uFF440-9\+＋]/g, ""), "-->" + ans + "-->合計" + sum, sec);
            return;
        }
        catch (e) {
            return message.channel.send("この数字は処理できないで");
        }

    } else if (message.content.match(/^(s|S|ｓ)?[dD\uFF24\uFF44]66/)) {
        var random = null;
        var sec = 0;
        if (/^(s|S|ｓ)/.test(message.content)) {
            sec = 1;
        }

        var ans = (Math.floor(((mt.random() * 10000000) % 6) + 1) * 10 + Math.floor(((mt.random() * 10000000) % 6) + 1));
        say('d66', "-->" + ans.toString(), sec);
    }


    else if ((message.content.match(/^(s|S|ｓ)?\d*[dD\uFF24\uFF44]{1,2}\d+/))) {
        try {
            var getDiceString = message.content;
            var sec = 0;
            if (/^(s|S|ｓ)/.test(getDiceString)) {
                sec = 1;
                getDiceString = getDiceString.substr(1);
            }

            var tmp = getDiceString.split(/ |　/, 2);//1d100とかの入力文字列を配列として認識

            if (/^[1-9]/.test(tmp[0])) {
                var prefix = tmp[0].split(/[^\d]/); //prefixは1d100 60から得られる[1 100]の配列
                prefix = prefix.filter(Boolean);
            }
            else {
                var prefix = [1, tmp[0].match(/\d+/)];

            }


            var random = null;
            var tmpVa = []; //ダイス結果を格納する配列
            var total = 0;

            for (var i = 0; i < prefix[0]; i++) {
                //ダイスwoを振ってtmpVaに記憶していく処理
                random = Math.floor(((mt.random() * 10000000) % prefix[1]) + 1);
                tmpVa.push(random);
                total = total + parseInt(random);
            }

            var result;
            if (message.content.match(/[dD\uFF24\uFF44]{2}/)) {
                tmpVa.sort(compareFunc);
            }

            if ((tmp.length > 1) & /^\d/.test(tmp[1])) {
                //成功値が指定されている場合
                var suc = tmp[1].match(/\d+/); //成功値

                if (tmp[1].startsWith(0)) {      //反転する場合
                    if (suc[0] > total) {    //失敗
                        if (tmpVa.length > 1) {
                            result = "-->合計" + total + "-->失敗";
                        }
                        else {
                            result = "-->失敗";
                        }
                    }
                    else if (suc[0] < total) {    //成功
                        if (tmpVa.length > 1) {
                            result = "-->合計" + total + "-->成功";
                        }
                        else {
                            result = "-->成功";
                        }
                    }
                    else {    //等しい
                        if (tmpVa.length > 1) {
                            result = "-->合計" + total + "-->成功";
                        }
                        else {
                            result = "-->成功";
                        }
                    }

                    say(tmp[0], "-->" + tmpVa + result, sec, "反転モード(成功値以上で成功)");

                }


                else {      //反転しない場合

                    if ((prefix[0] == 1) & (prefix[1] == 100) & (tmpVa[0] <= 5)) {
                        //CoCのクリティカル処理
                        result = "-->決定的成功(クリティカル)！";
                    } else if ((prefix[0] == 1) & (prefix[1] == 100) & (tmpVa[0] >= 96)) {
                        //CoCのファンブル処理
                        result = "-->致命的失敗(ファンブル)";
                    } else if ((prefix[0] == 2) & (prefix[1] == 6)) {
                        switch (total) {
                            case 2:
                                result = "-->合計" + total + "-->致命的失敗";
                                break;
                            case 12:
                                result = "-->合計" + total + "-->スペシャル！";
                                break;
                            default:
                                if (total < suc) {
                                    result = "-->合計" + total + "-->失敗";
                                } else {
                                    result = "-->合計" + total + "-->成功";
                                }
                                break;
                        }
                    }
                    else if (suc[0] > total) {
                        if (tmpVa.length > 1) {
                            result = "-->合計" + total + "-->成功";
                        } else {
                            result = "-->成功";
                        }
                    } else if (suc[0] < total) {
                        if (tmpVa.length > 1) {
                            result = "-->合計" + total + "-->失敗";
                        } else {
                            result = "-->失敗";
                        }
                    } else {
                        if (tmpVa.length > 1) {
                            result = "-->合計" + total + "-->成功";
                        } else {
                            result = "-->成功";
                        }
                    }
                    say(tmp[0], "-->" + tmpVa + result, sec);


                }




            } else {
                //成功値が指定されていない場合

                if ((prefix[0] == 1) & (prefix[1] == 100) & (tmpVa[0] <= 5)) {
                    //CoCのクリティカル処理
                    result = "-->決定的成功(クリティカル)！";
                } else if ((prefix[0] == 1) & (prefix[1] == 100) & (tmpVa[0] >= 96)) {
                    //CoCのファンブル処理
                    result = "-->致命的失敗(ファンブル)";
                } else if (prefix[0] == 1) {
                    //ダイス1個の場合
                    result = null;
                } else if (tmpVa.length > 1) {
                    //(ここ99%ただのelseでいいけど一応),ダイスが複数の場合
                    result = "-->合計" + total;
                }
                if (result !== null) {
                    say(tmp[0], "-->" + tmpVa + result, sec);
                } else {
                    say(tmp[0], "-->" + tmpVa, sec);
                }
            }
            return;
        }
        catch (e) {
            return message.channel.send("この数字は処理できないで");
        }
    }





    else if (message.content.match(/^(s|S|ｓ)?\d+[Ddｄ][Mmｍ][　 ]?\d+/)) {
        var getDiceString = message.content;
        var sec = 0;
        if (/^(s|S|ｓ)/.test(getDiceString)) {
            sec = 1;
            getDiceString = getDiceString.substr(1);
        }
        var input = getDiceString.split(/[Ddｄ][Mmｍ]/, 2);
        var suc = input[1].match(/\d+/);
        var random = null;
        var tmpVa = [];
        var n = 0;
        var result;

        for (var i = 0; i < input[0]; i++) {
            //ダイスをinput[0]回振る,nが成功数
            random = Math.floor(((mt.random() * 10000000) % 10) + 1);
            tmpVa.push(random);

            switch (
            random //ダイスの出目分岐
            ) {
                case 1:
                    n = n + 2;
                    break;
                case 10:
                    if (suc != 10) {
                        n = n - 1;
                    }
                    break;
                default:
                    if (random <= suc) {
                        n++;
                    }
                    break;
            }
        }

        switch (
        n //成功数分岐
        ) {
            case 0:
                result = " 失敗";
                break;
            case 1:
                result = "成功";
                break;
            case 2:
                result = "効果的成功";
                break;
            case 3:
                result = "極限成功";
                break;
            default:
                if (n < 0) {
                    result = "致命的失敗";
                } else if (n > 9) {
                    result = "災厄的成功";
                } else {
                    result = "奇跡的成功";
                }
                break;
        }
        say(input[0] + "d10", "-->" + tmpVa + "-->成功数:" + n + "-->" + result, sec);
    }

    //バラバラダイス
    if (/^(s|S|ｓ)?[bBｂ0-9]/.test(message.content) & /b|ｂ|B|\uFF42/.test(message.content) & /\d/.test(message.content) & /\+|＋/.test(message.content)) {
        try {
            if (/d/.test(message.content)) {
                return;
            }

            var getDiceString = message.content;
            var sec = 0;
            if (/^(s|S|ｓ)/.test(getDiceString)) {
                sec = 1;
                getDiceString = getDiceString.substr(1);
            }

            var tmp = getDiceString.split(/ |　/, 2);
            var s = 0;
            if ((tmp.length > 1) & /^\d/.test(tmp[1])) {
                //成功値が指定されている場合
                var suc = tmp[1].match(/\d+/);
                s = 1;
                var sum = 0;
            }
            var tm = tmp[0].replace(/[^bBｂ\uFF420-9\+＋]/g, "");
            var input = tm.split(/\+|＋/);
            var result = []; //結果の格納配列

            for (var i = 0; i < input.length; i++) {
                if (input[i].match(/\d+[bB\uFF22\uFF42]\d+/)) {
                    //1d3型
                    var prefix = input[i].split(/[^\d]/); //prefix[0]がダイス数、prefix[1]がダイスの面の数
                    prefix = prefix.filter(Boolean);
                    var random = null;//個々の出目に対応

                    for (var j = 0; j < parseInt(prefix[0]); j++) {
                        //振る
                        random = Math.floor(
                            ((mt.random() * 10000) % parseInt(prefix[1])) + 1
                        );
                        result.push(random);
                        if (s == 1) {
                            if (random <= suc) {
                                sum++;
                            }
                        }
                    }

                } else if (input[i].match(/^[bB\uFF22\uFF42]\d+/)) {
                    //d3型
                    var prefix = input[i].match(/\d+/);
                    var random = Math.floor(((mt.random() * 10000) % prefix) + 1);
                    result.push(random);
                    if (s == 1) {
                        if (random <= suc) {
                            sum++;
                        }
                    }
                }
            }

            if (s == 0) {
                result = "-->" + result.toString();
            } else {
                result = "-->" + result.toString() + "-->成功数:" + sum;
            }
            say(tmp[0].replace(/[^bBｂ\uFF420-9\+＋]/g, ""), result, sec);
            return;
        }
        catch (e) {
            return message.channel.send("この数字は処理できないで");
        }

    }



    else if (message.content.match(/^(s|S|ｓ)?\d*[bB\uFF22\uFF42]{1,2}\d+/)) {

        try {
            var getDiceString = message.content;
            var sec = 0;
            if (/^(s|S|ｓ)/.test(getDiceString)) {
                sec = 1;
                getDiceString = getDiceString.substr(1);
            }
            var tmp = getDiceString.split(/ |　/, 2);//1d100とかの入力文字列を配列として認識
            if (/^[1-9]/.test(tmp[0])) {
                //1d100型の時
                var prefix = tmp[0].split(/[^\d]/);
                prefix = prefix.filter(Boolean);
            } else {
                //d100型の時
                var prefix = [1, tmp[0].match(/\d+/)];
            }

            var s = 0;
            if ((tmp.length > 1) & /^\d/.test(tmp[1])) {
                //成功値が指定されている場合
                var suc = tmp[1].match(/\d+/);
                s = 1;
                var sum = 0;
            }

            var random = null;
            var tmpVa = [];
            var result;

            for (var i = 0; i < prefix[0]; i++) {
                random = Math.floor(((mt.random() * 10000000) % prefix[1]) + 1);
                tmpVa.push(random);
                if (s == 1) {
                    if (random <= suc) {
                        sum++;
                    }
                }
            }

            if (message.content.match(/[bB\uFF22\uFF42]{2}/)) {
                tmpVa.sort(compareFunc);
            }

            if (s == 0) {
                result = "-->" + tmpVa.toString();
            } else {
                result = "-->" + tmpVa.toString() + "-->成功数:" + sum;
            }

            say(tmp[0], result, sec);
            return;
        }
        catch (e) {
            return message.channel.send("この数字は処理できないで");
        }
    }


    function say(title, text, secret = 0, footer = " ") {
        //sayの定義ブロック

        if (mt.random() < 0.05) {
            footer = footer + "FANBOX開設してません";
        }
        let embed;
        try {
            embed = new discord.EmbedBuilder()
                .setAuthor({
                    name: message.member.displayName,
                    iconURL: message.author.avatarURL({ format: "png", size: 1024 }),
                })
                .addFields({ name: title, value: text })
                .setColor(0x42f7c9)
                .setFooter({ text: footer });
        }
        catch (e) {
            embed = new discord.EmbedBuilder()
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.avatarURL({ format: "png", size: 1024 }),
                })
                .addFields({ name: title, value: text })
                .setColor(0x42f7c9)
                .setFooter({ text: footer });
        }

        if (secret && !(message.channel.type === ChannelType.DM)) {
            message.delete();
            const user = client.users.cache.get(message.author.id);
            user.send({ embeds: [embed] });
            message.channel.send("🎲 Secret Dice 🎲");
        }
        else message.channel.send({ embeds: [embed] });


        client.user.setPresence({
            activities: [{ name: "bothelp", type: ActivityType.Playing }],
            status: "online",
        });

    }
});

function compareFunc(a, b) {
    return b - a;
}

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);


client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "page1") {
        await interaction.deferUpdate();
        const reply = await interaction.editReply({
            embeds: [help1],
        });
        setTimeout(() => reply.edit({ components: [] }), 30000);
    } else if (interaction.customId === "page2") {
        await interaction.deferUpdate();
        const reply = await interaction.editReply({
            embeds: [help2],
        });
        setTimeout(() => reply.edit({ components: [] }), 30000);
    } else if (interaction.customId === "page3") {
        await interaction.deferUpdate();
        const reply = await interaction.editReply({
            embeds: [help3],
        });
        setTimeout(() => reply.edit({ components: [] }), 30000);
    } else if (interaction.customId === "allpage") {
        await interaction.deferUpdate();
        const reply = await interaction.editReply({
            embeds: [helpall],
        });
        setTimeout(() => reply.edit({ components: [] }), 30000);
    }
});

const page1 = new discord.ButtonBuilder()
    .setCustomId("page1")
    .setStyle(ButtonStyle.Primary)
    .setLabel("Page 1");
const page2 = new discord.ButtonBuilder()
    .setCustomId("page2")
    .setStyle(ButtonStyle.Primary)
    .setLabel("Page 2");
const page3 = new discord.ButtonBuilder()
    .setCustomId("page3")
    .setStyle(ButtonStyle.Primary)
    .setLabel("Page 3");
const allpage = new discord.ButtonBuilder()
    .setCustomId("allpage")
    .setStyle(ButtonStyle.Primary)
    .setLabel("全文表示");


let help1 = new discord.EmbedBuilder()
    .setTitle("このbotの使い方！")
    .setDescription(
        "任意の個数のn面ダイスが振れるbotやで\
\n今の対応システムはCoC,シノビガミ,エモクロアや\
\n詳しい使い方は[ここ](https://note.com/naruhiko_ou/n/n17eb863930e9)を見てな"
    )
    .addFields(
        {
            name: "一覧表示", value: "「bothelp all」で全文表示できるで"
        },
        {
            name: "ダイスの振り方(例)",
            value:
                "「1d100」「2d6」「d20」と送るとそれぞれ100面ダイス1個,6面ダイス2個,20面ダイス1個を振るで\
\n「1d100 60」は成功値60で成功判定付きでCoCのダイスロールをするで\
\n「2d6 5」は成功値5のシノビガミのダイスロールをするで\
\n成功値ピッタリの時は成功って言うけどプロットの逆凪の判定には注意してな\
\n成功値の最初に0をつけたら成功判定がひっくり返るで\
\nたとえば「1d10 05」は5以下で成功や\
\nエモクロアは成功数も判定するで\
\nその場合は「2dm6」と打つと成功値6の10面ダイスを2個振るで\
\n「+」を間に挟んで「1d3+1d6」とか「1d3+1」みたいにも振れるで",
        },
        {
            name: "期待値機能",
            value:
                "「exp 1d100」みたいにexpをつけてダイスロールコマンドを送るとそのダイスの期待値を送るで",
        }
    )
    .setColor(0x42f7c9)
    .setFooter({ text: "page 1/3 30秒間リアクションで移動できます" });

let help2 = new discord.EmbedBuilder()
    .setTitle("このbotの使い方！")
    .addFields(
        {
            name: "クイックダイス",
            value:
                "「dd」「ささ」と送ると1d100が振れるで\
\n「ss」「なな」と送ると2d6が振れるで\
\n素早く振りたい時におすすめの機能や\
\nddとかssの後に成功値をつけることもできるで(それぞれCoC,シノビガミの判定をするで)\
\nこのとき空白はなくてもええで",
        },
        {
            name: "シャッフル・チョイス機能",
            value:
                "「shuffle」や「choice」の後にいくつか要素を並べて送ると要素をランダムに並び替えたり、\
\n取り出したりできるで\
\n(例1)「shuffle りんご もも みかん」\
\n「りんご,みかん,もも」みたいにランダムに並び替えるで\
\n(例2)「choice りんご もも みかん」\
\n3つのどれかをランダムに返すで\
\n「choice2 りんご もも みかん」みたいにchoiceの直後に数字をつけるとその数だけ取り出すで(重複なしや)\
\n「choice2,りんご,もも,みかん」と空白じゃなくて「,」にしても反応するで\
\n「choicex2 りんご もも みかん」みたいにchoicexにすると重複ありになるで(数字つけてな)\
\n「shuffle」「choice」は「ff」「cc」でも反応するで",
        }
    )
    .setColor(0x42f7c9)
    .setFooter({
        text: "page 2/3 30秒間リアクションで移動できます",
    });

let help3 = new discord.EmbedBuilder()
    .setTitle("このbotの使い方！")
    .addFields(
        {
            name: "シークレットダイス",
            value: "ダイスコマンドの最初に「s」を付けるとDMでダイス結果が届くで",
        },
        {
            name: "バラバラダイス",
            value:
                "「d」の代わりに「b」を使うと足し算しなくなるで\
           \n「2b6+3b10 3」やと2b6と3b10で5回ロールして、\
           \nいくつ3以下の出目が出て成功したか判定するで\
           \n成功値の直前以外に空白を入れたり、dとb両方使ったりせんといてな",
        },
        {
            name: "結果並び替え",
            value: "d,bをそれぞれ2つにすると結果を降順に並び替えるで\
              \n例えば「3dd100」「3bb100」と打つとその結果が\
              \n「98 50 17」みたいに降順になるで"
        }
    )
    .setColor(0x42f7c9)
    .setFooter({
        text: "page 3/3 30秒間リアクションで移動できます|このbotに「パンダ」と言うと……？",
    });

let helpall = new discord.EmbedBuilder()
    .setTitle("このbotの使い方！")
    .setDescription(
        "任意の個数のn面ダイスが振れるbotやで\
\n今の対応システムはCoC,シノビガミ,エモクロアや\
\n詳しい使い方は[ここ](https://note.com/naruhiko_ou/n/n17eb863930e9)を見てな"
    )
    .addFields(
        {
            name: "ダイスの振り方(例)",
            value:
                "「1d100」「2d6」「d20」と送るとそれぞれ100面ダイス1個,6面ダイス2個,20面ダイス1個を振るで\
\n「1d100 60」は成功値60で成功判定付きでCoCのダイスロールをするで\
\n「2d6 5」は成功値5のシノビガミのダイスロールをするで\
\n成功値ピッタリの時は成功って言うけどプロットの逆凪の判定には注意してな\
\n成功値の最初に0をつけたら成功判定がひっくり返るで\
\nたとえば「1d10 05」は5以下で成功や\
\nエモクロアは成功数も判定するで\
\nその場合は「2dm6」と打つと成功値6の10面ダイスを2個振るで\
\n「+」を間に挟んで「1d3+1d6」とか「1d3+1」みたいにも振れるで",
        },
        {
            name: "期待値機能",
            value:
                "「exp 1d100」みたいにexpをつけてダイスロールコマンドを送るとそのダイスの期待値を送るで",
        },
        {
            name: "クイックダイス",
            value:
                "「dd」「ささ」と送ると1d100が振れるで\
\n「ss」「なな」と送ると2d6が振れるで\
\n素早く振りたい時におすすめの機能や\
\nddとかssの後に成功値をつけることもできるで(それぞれCoC,シノビガミの判定をするで)\
\nこのとき空白はなくてもええで",
        },
        {
            name: "シャッフル・チョイス機能",
            value:
                "「shuffle」や「choice」の後にいくつか要素を並べて送ると要素をランダムに並び替えたり、\
\n取り出したりできるで\
\n(例1)「shuffle りんご もも みかん」\
\n「りんご,みかん,もも」みたいにランダムに並び替えるで\
\n(例2)「choice りんご もも みかん」\
\n3つのどれかをランダムに返すで\
\n「choice2 りんご もも みかん」みたいにchoiceの直後に数字をつけるとその数だけ取り出すで(重複なしや)\
\n「choice2,りんご,もも,みかん」と空白じゃなくて「,」にしても反応するで\
\n「choicex2 りんご もも みかん」みたいにchoicexにすると重複ありになるで(数字つけてな)\
\n「shuffle」「choice」は「ff」「cc」でも反応するで",
        },
        {
            name: "シークレットダイス",
            value: "ダイスコマンドの最初に「s」を付けるとDMでダイス結果が届くで",
        },
        {
            name: "バラバラダイス",
            value:
                "「d」の代わりに「b」を使うと足し算しなくなるで\
           \n「2b6+3b10 3」やと2b6と3b10で5回ロールして、\
           \nいくつ3以下の出目が出て成功したか判定するで\
           \n成功値の直前以外に空白を入れたり、dとb両方使ったりせんといてな",
        },
        {
            name: "結果並び替え",
            value: "d,bをそれぞれ2つにすると結果を降順に並び替えるで\
              \n例えば「3dd100」「3bb100」と打つとその結果が\
              \n「98 50 17」みたいに降順になるで"
        }
    )
    .setColor(0x42f7c9)
    .setFooter({ text: "このbotに「パンダ」と言うと……？" });
