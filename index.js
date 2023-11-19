global.print = console.log
const {Mxtorie} = require('./structures/client')
console.clear()
console.log('>> process started.')
const client = new Mxtorie()
inAppEval()
const colors = {$:{n:30, r:31, g:32, y:33, b:34, m:35, c:36, w:97, 0:0, 1:1, 2:2, 3:3, 4:4}, $$:{n:40, r:41, g:42, y:43, b:44, m:45, c:46, w:107}}

function colorized(str){
    if (str.constructor.name !== "String") throw new Error("Argument must be a string");
    return str.replace(/\${1,2}([a-z0-4])/g, (t)=>{
        const color = t.startsWith("$$") ? colors["$$"][t[t.length-1]] : colors["$"][t[t.length-1]];
        if (color === undefined) return "";
        else return `\x1b[${color}m`;
    })+"\x1b[0m"
}

function exitListener(){
    process.stdin.removeAllListeners('data');
    process.stdin.pause();
    console.log(colorized(`[$b eval $0]: exit successfully.$0`))
}

function inAppEval(){
    process.stdin.resume()
    process.stdout.write(">>> ")
    process.stdin.on("data", async function(data) {
        process.stdin.pause();
        data = data.toString().trim();
        if (data === ".clear") { console.clear(); }
        else if (data === ".exit") return exitListener()
        else if (data === ".help") {
            console.log(colorized("  << $bInAppEval Help$0 >>  \n\n$y.clear$0 -> Clear the console\n$y.help$0 -> see the help\n$r.exit$0 -> exit the eval\n\n  Enjoy ! ;)"));
        }
        else try {
                let evaled = eval(data);
                console.log(colorized(`[$b eval $0]: ${require("util").inspect(evaled, { colors: true, depth: 0 })}`))
            } catch(err) {
                console.error(colorized(`[$b eval $0]: $r<ERROR> ${err}$0`))
            }
        process.stdout.write(">>> ");
        process.stdin.resume();
    })
}