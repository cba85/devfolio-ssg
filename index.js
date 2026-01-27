// Modules import
import fs from "fs";
import { Edge } from "edge.js";
import matter from "gray-matter";
import markdownit from "markdown-it";
import purify from "purify-css";

// Variables / Constants
const projectsFolder = "./projects";
const renderFolder = "./public";

// Configuration
const edge = Edge.create();
edge.mount(new URL("./views", import.meta.url));
const md = markdownit();

// Setup render
fs.mkdirSync(renderFolder, { recursive: true });
fs.cpSync("./assets", renderFolder, { recursive: true });

// Projects

let projects = [];

const projectFiles = fs.readdirSync(projectsFolder, { encoding: "utf-8" });

for (const projectFile of projectFiles) {
  const content = fs.readFileSync(`${projectsFolder}/${projectFile}`, { encoding: "utf-8" });
  const parsedContent = matter(content);
  const markdown = parsedContent.content;
  const contentHtml = md.render(markdown);

  const project = {};
  project.html = contentHtml;
  project.data = parsedContent.data;

  projects.push(project);
}

// Render HTML file

const html = edge.renderSync("index", { projects });
fs.writeFileSync(`${renderFolder}/index.html`, html, { recursive: true });

// Clean CSS
const css = fs.readFileSync(`assets/main.bundle.css`, { encoding: "utf-8" });

let options = {
  output: "public/style.min.css",
  minify: true,
};
purify(html, css, options);

// OUTPUT

console.log("WEBSITE GENERATED!");
