


const r = sum(2, 3).finally("Finally")

function sum(x, y) {
    console.log("Inside sum first")

    const p = new Promise((resolve, reject) => {
        console.log("INside promise constructor");
        if (x == 7) {
            reject("Alodhim!")
        }
        setTimeout(() => {
            console.log("inside set timeout")
            // const page = fetch('https://debolx.com').then(res => resolve(res))
        }, 1000)

        console.log("after resolve")
    })
    console.log("b4 return")
    return p
}