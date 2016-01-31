var fs = require('fs');
var path = require('path');
var newLine = '\n'; // TODO: OS specific

var sourceFile = '../azure-content-pr/articles/guidance/guidance-elasticsearch-data-ingestion.md';

function extractInlineLinks(markdown) {

    var pattern = /(\[[\w\s]+\])\(([\w:/\.\#-]+)\)/g;

    var links = [];
    var result;
    while ((result = pattern.exec(markdown)) !== null) {
        links.push({
            original: result[0],
            label: result[1],
            url: result[2]
        });
    }

    return links;
}

function sortTable(a,b) {
    var aa = a.label.toLowerCase();
    var bb = b.label.toLowerCase();
    return +(aa > bb) || +(aa === bb) - 1;
}

fs.readFile(sourceFile, 'utf8', (err, markdown) => {
    if (err) throw err;

    var links = extractInlineLinks(markdown);

    var table = '' + newLine;

    links.sort(sortTable).forEach(link => {
        var replacement = link.label + '[]';
        markdown = markdown.replace(link.original, replacement);

        table += link.label + ': ' + link.url + newLine;
    });

    markdown += table;

    fs.writeFile(sourceFile, markdown);
});
