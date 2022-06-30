process.on("message", (cantidad) => {
    function randomNumbers(cantidad) {
        const numeros = {};
        for (let i = 1; i <= cantidad; i++) {
            numeros[i] = Math.floor(Math.random() * 1000) + 1;
        }
        return numeros;
    }
    process.send(randomNumbers(cantidad));
});

