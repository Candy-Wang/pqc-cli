#!/usr/bin/env node
// 进行命令行的操作
import { Command } from 'commander';
const program = new Command();
// 提示文字
import chalk from 'chalk';
// 提示符号
import logSymbols from "log-symbols";
// 命令行交互插件 使用require的话，请安装8.0版本， 之后的版本不支持esm的模块
import inquirer from 'inquirer';

import { templateObject } from './templates.js';

import { initAndCloneProject, downloadTemplate, descriptionNextStep } from './tools.js';


/**
 * @param {*} templateObject
 * @returns 当前模板数组
 */

const getTemplateList = (templateObject) => {
    let templateList = [];
    for(let key in templateObject) {
        templateList.push(key);
    }
    return templateList;
}

program
    .version('1.0.0')

program
    .command('atm')
    .action(() => {
        console.log(logSymbols.info, chalk.yellow(`ATM`))
    });

program
    .command('use')
    .description('如何使用pqc-cli')
    .action(() => {
        console.log(logSymbols.info, chalk.yellow('第一步：运行 pqc-cli list'))
        console.log(logSymbols.info, chalk.yellow('第二步：运行 pqc-cli init 模板名称 自定义名称'))
        console.log(logSymbols.info, chalk.yellow('第三步：按照步骤初始化模板即可'))
    })

program
    .command('help [command]')
    .description('帮助命令')

program
    .command('que')
    .description('询问')
    .action(() => {
        inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'router',
                    message: '是否安装路由?',
                },
                {
                    type: 'confirm',
                    name: 'pinina',
                    message: '是否安装pinia?'
                }
            ]).then(answers => {
                console.log(answers);
                // 写入文件
            }).catch(err => {
                console.log(err);
            })
    })

program
    .command('init')
    .description('请选择模板下载')
    .action(() => {
        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    name: 'projectName',
                    message: '请选择需要下载的模板:',
                    choices: getTemplateList(templateObject),
                }
            ]).then(answers => {
                console.log(answers);
                
                downloadTemplate(answers.projectName).then(() => {
                    // 提示用户进入项目安装
                    descriptionNextStep(answers.projectName)
                })
            }).catch(err => {
                console.log(err);
            })
    })

program
    .command('init <templateName> <projectName>')
    .description('初始化模板')
    .action((templateName, projectName) => {
        downloadTemplate(templateName, projectName)
            .then(() => {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: '请输入项目名称',
                        },
                        {
                            type: 'input',
                            name: 'description',
                            message: '请输入项目简介',
                        },
                        {
                            type: 'input',
                            name: 'author',
                            message: '请输入项目作者',
                        },
                    ])
                    .then(answers => {
                        initAndCloneProject(projectName, answers).then(() => {
                            descriptionNextStep(projectName);
                        });
                    })
                    .catch(error => {
                        if (error.isTtyError) {
                            console.log(logSymbols.error, chalk.red(error));
                        } else {
                            console.log(logSymbols.error, chalk.yellow(error));
                        }
                    })
            })
    })

program
    .command('list [command]')
    .description('获取当前可用模板列表')
    .action(() => {
        console.log(chalk.green('当前可用模板: \n'));
        for (let key in templateObject) {
            console.log(logSymbols.info, `模板名称：${key}`)
            console.log(logSymbols.info, `模板介绍：${templateObject[key].description}`)
            console.log(`\n`)
        }
    })

program.parse();