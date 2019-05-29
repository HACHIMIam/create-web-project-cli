import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPromts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false
  };
}
async function promptForMissingOptions(options) {
  const defaultTemplate = "React";
  if (options.skipPromts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }
  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["React", "Vue"],
      default: defaultTemplate
    });
  }
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repositpry",
      default: false
    });
  }
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  };
}
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
