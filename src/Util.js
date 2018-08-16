
export function applyPredicatesOnText(text, predicates) {
    var result = '';
    var lines = text.split("\n");
    const nPredicate = predicates.length;
    if (nPredicate === 0) {
        return text;
    }
    
    for (var i = 0; i < lines.length; i++) {
        const l = lines[i];
        var match = false;
        var color;
        for (var j = 0; j < nPredicate; j++) {
            const p = predicates[j];
            if (l.includes(p.pattern)) {
                match = true; 
                color = p.color;
                break;
            }
        }
        if (match) {
            result += formatLine(l, color);
            result += '\n';
        }
    }
    
    return result;
}

export function formatLine(line, color) {
    let l = "<font color=\"" + color +"\">";
    l += line;
    l += "</font>";
    return l;
}

export function trimText(text) {
    var lines = text.split("\n");
    
    const startPattern = "CASTER | ====================== POPULATE";
    let startIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes(startPattern)) {
            startIndex = i;
            break;
        }
    }
    
    if(startIndex < 0) {
        throw new Error("Nothing to analyze, " + startPattern + " not found");
    }
    
    let result = '';
    const endPattern = "CASTER | ====================== END OF CAST";
    for (let i = startIndex; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes(endPattern)) {
            break;
        } else{
            result += l;
            result += '\n';
        }
    }

    return result;
}