
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
            result += "<font color=\"" + color +"\">";
            result += l;
            result += "</font>";
            result += '\n';
        }
    }

    return result;
}