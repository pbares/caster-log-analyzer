
const eol = '\n';

function matchLine(line, predicate) {
    return line.includes(predicate.pattern);
}

/**
 * Or between predicates
 */
export function applyPredicatesOnText(text, orPredicates, andPredicates) {
    let result = '';
    let lines = text.split(eol);
    const nPredicate = orPredicates.length;

    for (var i = 0; i < lines.length; i++) {
        const l = lines[i];
        if(l === "") {
            continue;
        }

        if (andPredicates !== undefined && !andPredicates.every(p => matchLine(l, p))){
            continue;
        }

        let match = true;
        let color;
        if(nPredicate > 0) {
            match = false;
            for (var j = 0; j < nPredicate; j++) {
                const p = orPredicates[j];
                if (matchLine(l, p)) {
                    match = true;
                    color = p.color;
                    break;
                }
            }
        }

        if (match) {
            result += color !== undefined ? formatLine(l, color) : l;
            result += eol;
        }
    }

    return result;
}

export function formatLine(line, color) {
    let l = "<font color=\"" + color + "\">";
    l += line;
    l += "</font>";
    return l;
}

export function trimText(text) {
    var lines = text.split(eol);

    const startPattern = "CASTER | ====================== POPULATE";
    let startIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes(startPattern)) {
            startIndex = i;
            break;
        }
    }

    if (startIndex < 0) {
        throw new Error("Nothing to analyze, " + startPattern + " not found");
    }

    let result = '';
    const endPattern = "CASTER | ====================== END OF CAST";
    for (let i = startIndex; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes(endPattern)) {
            break;
        } else {
            result += l;
            result += eol;
        }
    }

    return result;
}