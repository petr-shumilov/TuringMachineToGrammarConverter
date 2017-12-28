const fs = require('fs');
const os = require('os');

try {

    let turingMachineSrc = fs.readFileSync('tm.src', 'utf-8');

    let deltaFunctions = [];
    let states = new Set();
    turingMachineSrc.split(os.EOL).forEach((line) => {

        let parsedLine = /([^\s]+) ([^\s]+) -> ([^\s]+) ([^\s]+) ([^\s]+)/.exec(line);

        if (parsedLine !== null) {
            // init delta functions
            deltaFunctions.push({
                fromSymbol: parsedLine[1],
                fromState: parsedLine[2],
                toSymbol: parsedLine[3],
                toState: parsedLine[4],
                shift: parsedLine[5]
            });

            // collect all states
            states.add(parsedLine[2]);
        }
    });

    // init Turing Machine obj
    const EPS = 'E';
    const Blank = 'B';
    const LeftMarker = '#';
    const RightMarker = '$';
    const turingMachine = {
        states: Array.from(states).push('Qk'),
        tapeSymbols: [LeftMarker, RightMarker, '1_1_0', '0_B_0', '1', '0_B_1', '0_0_1', '0', '0_0_0', '0_0_B', '1_1_1', '1_B_B', '0_1_1', '1_0_1', '1_0__1', '1_1_B', '0_1_0', '1_0_0', '0_1_B', '1_B_0', '0_0__1', '1_0_B', '1_B_1', '0_B_B'],
        inputSymbols: ['0', '1', LeftMarker, RightMarker],
        deltaFunctions: deltaFunctions,
        startState: 'Q0',
        acceptState: 'Qk'
    };



    let grammar = {};
    // build grammar
    grammar['A1'] = `${turingMachine.startState}A2`;
    grammar['A2'] = [];
    for (let a in turingMachine.inputSymbols) {
        grammar['A2'].push(`[${a},${a}]A2`);
    }
    grammar['A2'].push('A3');
    grammar['A3'] = [];
    grammar['A3'].push(`[${EPS},${Blank}]A3`);
    grammar['A3'].push(EPS);


    turingMachine.deltaFunctions.filter((deltaFunction) => {return (deltaFunction.shift === 'R')}).forEach((deltaFunction) => {
        turingMachine.inputSymbols.concat(EPS).forEach((a) => {
            let from = `${deltaFunction.fromState}[${a},${deltaFunction.fromSymbol}]`;
            let to = `[${a},${deltaFunction.toSymbol}]${deltaFunction.toState}`;
            (grammar[from] = grammar[from] || []).push(to);

        });
    });


    turingMachine.deltaFunctions.filter((deltaFunction) => {return (deltaFunction.shift === 'L')}).forEach((deltaFunction) => {
        turingMachine.inputSymbols.concat(EPS).forEach((a) => {
            turingMachine.inputSymbols.concat(EPS).forEach((b) => {
                turingMachine.tapeSymbols.forEach((E) => {
                    let from = `[${b},${E}]${deltaFunction.fromState}[${a},${deltaFunction.fromSymbol}]`;
                    let to = `${deltaFunction.toState}[${b},${E}][${a},${deltaFunction.toSymbol}]`;
                    (grammar[from] = grammar[from] || []).push(to);
                });
            });
        });
    });



    turingMachine.inputSymbols.concat(EPS).forEach((a) => {
        turingMachine.tapeSymbols.forEach((C) => {

            let from = `[${a},${C}]${turingMachine.acceptState}`;
            let _from = `${turingMachine.acceptState}[${a},${C}]`;
            let to = `${turingMachine.acceptState}${a}${turingMachine.acceptState}`;

            (grammar[from] = grammar[from] || []).push(to);
            (grammar[_from] = grammar[_from] || []).push(to);

        });
    });

    grammar[`${turingMachine.acceptState}${RightMarker}`] = [];
    grammar[`${turingMachine.acceptState}${RightMarker}`].push(EPS);

    grammar[`${LeftMarker}${turingMachine.acceptState}`] = [];
    grammar[`${LeftMarker}${turingMachine.acceptState}`].push(EPS);


    // output result
    let writeStream = fs.createWriteStream('grammar0.txt');
    Object.keys(grammar).forEach((key) => {
        if (Array.isArray(grammar[key]) === true) {
            for (let i = 0; i < grammar[key].length; ++i) {
                writeStream.write(`${key} -> ${grammar[key][i]}\n`);
            }
        }
        else {
            writeStream.write(`${key} -> ${grammar[key]}\n`);
        }
    });
    writeStream.end(() => {
        console.log("Done!");
    });
}

catch (e) {
    console.log(e.message);
}