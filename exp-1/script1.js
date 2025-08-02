const refs = {
  preview: document.getElementById("previewOutput"),
  editor: document.getElementById("htmlEditor"),
  search: document.getElementById("searchBox"),
  tagArea: document.getElementById("tagCategories"),
};

const tagGroups = {
  Structure: ["html", "head", "body", "title", "div", "span", "section", "nav"],
  Text: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "b", "strong", "i", "em", "u", "big", "small", "strike", "br", "hr", "pre", "marquee"],
  Links: ["a", "img", "video", "iframe", "embed", "noembed", "link", "meta"],
  List: ["ul", "ol", "li", "dl", "dt", "dd"],
  Table: ["table", "tr", "td", "th", "tt"],
  Form: ["form", "input", "button", "label", "textarea", "select", "option"],
  Deprecated: ["font", "center", "marquee", "strike", "tt"],
  Miscellaneous: ["comment"],
};

const selfClosingTags = new Set(["br", "hr", "img", "input", "meta", "link"]);

const examples = {
  html: '<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body><p>Hello World</p></body>\n</html>',
  head: '<head>\n  <meta charset="UTF-8">\n  <title>Sample Page</title>\n</head>',
  body: '<body>\n  <h1>Welcome</h1>\n</body>',
  title: '<title>My Awesome Page</title>',
  div: '<div>This is a &lt;div&gt; element</div>',
  span: '<span style="color:red;">This is a &lt;span&gt; element</span>',
  section: '<section><h2>Section Title</h2><p>Content here...</p></section>',
  nav: '<nav><a href="#">Home</a> | <a href="#">About</a></nav>',
  p: '<p>This is a paragraph.</p>',
  h1: '<h1>Main Heading</h1>',
  h2: '<h2>Sub Heading</h2>',
  h3: '<h3>Section Heading</h3>',
  b: '<b>Bold text</b>',
  strong: '<strong>Strong text</strong>',
  i: '<i>Italic text</i>',
  em: '<em>Emphasized text</em>',
  u: '<u>Underlined text</u>',
  big: '<big>Bigger text</big>',
  small: '<small>Smaller text</small>',
  strike: '<strike>Strikethrough</strike>',
  br: 'Line 1<br>Line 2<br>Line 3',
  hr: '<hr>',
  pre: `<pre>\n  for (let i = 0; i < 5; i++) {\n    console.log(i);\n  }\n</pre>`,
  marquee: '<marquee>This is scrolling text</marquee>',
  a: '<a href="https://example.com">Link to Example</a>',
  img: '<img src="https://via.placeholder.com/150" alt="Image">',
  iframe: '<iframe src="https://example.com" width="300" height="150"></iframe>',
  video: '<video controls width="250"><source src="movie.mp4" type="video/mp4">Not supported.</video>',
  embed: '<embed src="file.mp3" width="120" height="60" />',
  noembed: '<noembed>Fallback content</noembed>',
  link: '<link rel="stylesheet" href="style.css">',
  meta: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  ul: '<ul><li>Item A</li><li>Item B</li></ul>',
  ol: '<ol><li>Step 1</li><li>Step 2</li></ol>',
  li: '<li>List Item</li>',
  dl: '<dl><dt>HTML</dt><dd>HyperText Markup Language</dd></dl>',
  dt: '<dt>Term</dt>', dd: '<dd>Definition</dd>',
  form: `<form>\n  <label>Name: </label>\n  <input type="text" />\n</form>`,
  input: '<input type="text" placeholder="Enter text here">',
  button: '<button>Click Me</button>',
  label: '<label for="email">Email:</label> <input type="email" id="email">',
  textarea: '<textarea rows="4" cols="30">Default text</textarea>',
  select: '<select><option>One</option><option>Two</option></select>',
  option: '<option>Choose me</option>',
  comment: '<!-- This is a comment -->',
  font: '<font color="green">Deprecated tag</font>',
  center: '<center>This content is centered (deprecated).</center>',
  tt: '<tt>Monospaced text (deprecated)</tt>',
  th: '<th>Table Heading</th>',
  tr: '<tr><td>Row 1</td></tr>',
  td: '<td>Data Cell</td>',
  table: `<table border="1"><tr><th>Name</th><th>Age</th></tr><tr><td>John</td><td>30</td></tr></table>`
};

function renderTags() {
  refs.tagArea.innerHTML = Object.entries(tagGroups)
    .map(([group, tags]) => `
      <div class="tag-category">
        <h3>${group}</h3>
        <div class="tag-grid">
          ${tags.map(tag => `
            <button class="tag-btn" data-tag="${tag}">
              ${tag === "comment" ? "&lt;!-- --&gt;" : `&lt;${tag}${selfClosingTags.has(tag) ? " /" : ""}&gt;`}
            </button>`).join("")}
        </div>
      </div>
    `).join("");
}

function setOutput(html) {
  refs.preview.innerHTML = html;
  refs.editor.value = html;
}

function onTagClick(tag) {
  document.querySelectorAll(".tag-btn").forEach((btn) => btn.classList.remove("active"));
  const btn = document.querySelector(`.tag-btn[data-tag="${tag}"]`);
  btn?.classList.add("active");

  const example = examples[tag];
  const fallback = selfClosingTags.has(tag) ? `<${tag}>` : `<${tag}>Example</${tag}>`;
  setOutput(example || fallback);
}

refs.search.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll(".tag-btn").forEach((btn) => {
    btn.classList.toggle("hidden", !btn.dataset.tag.toLowerCase().includes(term));
  });
});

refs.tagArea.addEventListener("click", (e) => {
  const btn = e.target.closest(".tag-btn");
  if (btn) onTagClick(btn.dataset.tag);
});

refs.editor.addEventListener("input", () => {
  refs.preview.innerHTML = refs.editor.value;
});

window.addEventListener("DOMContentLoaded", () => {
  renderTags();
  onTagClick("p"); // default
});
