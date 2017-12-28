const fs = require('fs');
const os = require('os');

try {

    let tmSrc = fs.readFileSync('tm.src', 'utf-8');

    let deltaFunctions = [];
    let states = new Set();
    tmSrc.split(os.EOL).forEach((line) => {

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
    const tm = {
        states: Array.from(states),
        tapeSymbols: [LeftMarker, RightMarker, '1_1_0', '0_B_0', '1', '0_B_1', '0_0_1', '0', '0_0_0', '0_0_B', '1_1_1', '1_B_B', '0_1_1', '1_0_1', '1_0__1', '1_1_B', '0_1_0', '1_0_0', '0_1_B', '1_B_0', '0_0__1', '1_0_B', '1_B_1', '0_B_B'],
        inputSymbols: ['0', '1', LeftMarker, RightMarker],
        deltaFunctions: deltaFunctions,
        startState: 'Q0',
        acceptState: 'Qk'
    };



    let grammar = {};
    // build grammar

    // group 1
    grammar['A1'] = [];
    tm.inputSymbols.forEach((term) => {
        grammar['A1'].push(`[${LeftMarker} ${tm.startState} ${term} ${term} ${RightMarker}]`);
    });

    
    tm.deltaFunctions.filter((df) => {return (tm.states.includes(df.fromState));}).forEach((df) => {
        tm.inputSymbols.forEach((a) => {
            if (df.fromSymbol === LeftMarker && df.shift === 'R') {
                tm.tapeSymbols.forEach((X) => {
                    // 2.1
                    let from = `[${df.fromState} ${LeftMarker} ${X} ${a} ${RightMarker}]`;
                    if (grammar[from] === undefined) {
                        grammar[from] = [];
                    }
                    grammar[from].push(`[${LeftMarker} ${df.toState} ${X} ${a} ${RightMarker}]`);
                    //5.1
                    from = `[${df.fromState} ${LeftMarker} ${X} ${a}]`;
                    if (grammar[from] === undefined) {
                        grammar[from] = [];
                    }
                    grammar[from].push(`[${LeftMarker} ${df.toState} ${X} ${a}]`);
                });
            }
            else {
                if (df.fromSymbol === RightMarker && df.shift === 'L') {
                    tm.tapeSymbols.forEach((X) => {
                        // 2.4
                        let from = `[${LeftMarker} ${X} ${a} ${df.fromState} ${RightMarker}]`;
                        if (grammar[from] === undefined) {
                            grammar[from] = [];
                        }
                        grammar[from].push(`[${LeftMarker} ${df.toState} ${X} ${a} ${RightMarker}]`);
                        // 7.2
                        from = `[${X} ${a} ${df.fromState} ${RightMarker}]`;
                        if (grammar[from] === undefined) {
                            grammar[from] = [];
                        }
                        grammar[from].push(`[${df.toState} ${X} ${a} ${RightMarker}]`);
                    });
                }
                else {
                    if (df.shift === 'L') {
                        // 2.2
                        let from = `[${LeftMarker} ${df.fromState} ${df.fromSymbol} ${a} ${RightMarker}]`;
                        if (grammar[from] === undefined) {
                            grammar[from] = [];
                        }
                        grammar[from].push(`[${df.toState} ${LeftMarker} ${df.toSymbol} ${a} ${RightMarker}]`);
                        // 5.2
                        from = `[${LeftMarker} ${df.fromState} ${df.fromSymbol} ${a}]`;
                        if (grammar[from] === undefined) {
                            grammar[from] = [];
                        }
                        grammar[from].push(`[${df.toState} ${LeftMarker} ${df.toSymbol} ${a}]`);

                        tm.tapeSymbols.forEach((Z) => {
                            tm.inputSymbols.forEach((b) => {
                                // 6.2
                                let _from = `[${Z} ${b}][${df.fromState} ${df.fromSymbol} ${a}]`;
                                if (grammar[_from] === undefined) {
                                    grammar[_from] = [];
                                }
                                grammar[_from].push(`[${df.toState} ${Z} ${b}][${df.toSymbol} ${a}]`);

                                //6.4
                                _from = `[${LeftMarker} ${Z} ${b}][${df.fromState} ${df.fromSymbol} ${a}]`;
                                if (grammar[_from] === undefined) {
                                    grammar[_from] = [];
                                }
                                grammar[_from].push(`[${LeftMarker} ${df.toState} ${Z} ${b}][${df.toSymbol} ${a}]`);

                                // 7.3
                                _from = `[${Z} ${b}][${df.fromState} ${df.fromSymbol} ${a} ${RightMarker}]`;
                                if (grammar[_from] === undefined) {
                                    grammar[_from] = [];
                                }
                                grammar[_from].push(`[${df.toState} ${Z} ${b}][${df.toSymbol} ${a} ${RightMarker}]`);

                            });
                        });

                    }
                    else {
                        // 2.3
                        let from = `[${LeftMarker} ${df.fromState} ${df.fromSymbol} ${a} ${RightMarker}]`;
                        if (grammar[from] === undefined) {
                            grammar[from] = [];
                        }
                        grammar[from].push(`[${LeftMarker} ${df.toSymbol} ${a} ${df.toState} ${RightMarker}]`);

                        tm.tapeSymbols.forEach((Z) => {
                            tm.inputSymbols.forEach((b) => {
                                // 5.3
                                let _from = `[${LeftMarker} ${df.fromState} ${df.fromSymbol} ${a}][${Z} ${b}]`;
                                if (grammar[_from] === undefined) {
                                    grammar[_from] = [];
                                }
                                grammar[_from].push(`[${LeftMarker} ${df.toSymbol} ${a}][${df.fromState} ${Z} ${b}]`);
                                // 6.1
                                _from = `[${df.fromState} ${df.fromSymbol} ${a}][${Z} ${b}]`;
                                if (grammar[_from] === undefined) {
                                    grammar[_from] = [];
                                }
                                grammar[_from].push(`[${df.toSymbol} ${a}][${df.fromState} ${Z} ${b}]`);
                                //6.3
                                _from = `[${df.fromState} ${df.fromSymbol} ${a}][${Z} ${b} ${RightMarker}]`;
                                if (grammar[_from] === undefined) {
                                    grammar[_from] = [];
                                }
                                grammar[_from].push(`[${df.toSymbol} ${a}][${df.fromState} ${Z} ${b} ${RightMarker}]`);
                            });
                        });

                        // 7.1
                        from = `[${df.fromState} ${df.fromSymbol} ${a} ${RightMarker}}]`;
                        if (grammar[from] === undefined) {
                            grammar[from] = [];
                        }
                        grammar[from].push(`[${df.toSymbol} ${a} ${df.toState} ${RightMarker}]`);
                    }
                }
            }
        });
    });

    let finalStates = [tm.acceptState];
    finalStates.forEach((q) => {
        tm.tapeSymbols.forEach((X) => {
            tm.inputSymbols.forEach((a) => {
                let from = [
                    // 3
                    `[${q} ${LeftMarker} ${X} ${a} ${RightMarker}]`,
                    `[${LeftMarker} ${q} ${X} ${a} ${RightMarker}]`,
                    `[${LeftMarker} ${X} ${a} ${q} ${RightMarker}]`,
                    // 8
                    `[${q} ${LeftMarker} ${X} ${a}]`,
                    `[${LeftMarker} ${q} ${X} ${a}]`,
                    `[${q} ${X} ${a}]`,
                    `[${q} ${X} ${a} ${RightMarker}]`,
                    `[${X} ${a} ${q} ${RightMarker}]`
                ];
                for (let i = 0; i < from.length; ++i) {
                    if (grammar[from[i]] === undefined) {
                        grammar[from[i]] = [];
                    }
                    grammar[from[i]].push(`${a}`);
                }

                // 9
                tm.inputSymbols.forEach((b) => {
                    let _from = [
                        `${a}[${X} ${b}]`,
                        `${a}[${X} ${b} ${RightMarker}]`,
                        `[${X} ${a}]${b}`,
                        `[${LeftMarker} ${X} ${a}]${b}`
                    ];
                    for (let i = 0; i < _from.length; ++i) {
                        if (grammar[_from[i]] === undefined) {
                            grammar[_from[i]] = [];
                        }
                        grammar[_from[i]].push(`${a}${b}`);
                    }
                })
            });
        });
    });

    // 4
    tm.inputSymbols.forEach((a) => {
        grammar['A1'].push(`[${LeftMarker} ${tm.startState} ${a} ${a}]A2`);
        if (grammar['A2'] === undefined) {
            grammar['A2'] = [];
        }
        grammar['A2'].push(`[${a} ${a}]A2`);
        grammar['A2'].push(`[${a} ${a} ${RightMarker}]`);
    });

    // output result
    let writeStream = fs.createWriteStream('grammar1.txt');
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