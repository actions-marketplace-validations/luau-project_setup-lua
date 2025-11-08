function coreParseInputSemiColon(input: string): string[] {
    const l = input.length;
    const tokens: string[] = [];

    if (l > 0) {
        let i = 0;
        let s = 0;
        while (i < l) {
            if (input[i] === ";") {
                if (i + 1 < l) {
                    if (input[i + 1] === ";") {
                        i += 2;
                    }
                    else {
                        tokens.push(input.substring(s, i).replace(";;", ";"));
                        i++;
                        s = i;
                    }
                }
                else {
                    tokens.push(input.substring(s, i).replace(";;", ";"));
                    i++;
                    s = i;
                }
            }
            else {
                i++;
            }
        }

        tokens.push(input.substring(s).replace(";;", ";"));
    }

    return tokens
}

export function parseInputSemiColon(input: string | undefined): string[] {
    return input ? coreParseInputSemiColon(input.trim()) : [];
}