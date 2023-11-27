import { templateObject } from "./templates.js";
// 使用插件进行狭隘远程仓库的项目
import download from 'download-git-repo';
//模板引擎 
import Handlebars from 'handlebars';
// 文件读取
import fs from 'fs';
// 添加loading效果
import ora from 'ora';
// 提示文字
import chalk from 'chalk';
// 提示符号
import logSymbols from "log-symbols";


/**
 * @function initAndCloneProject 重写并初始化package.json文件
 * @param {*} PN 项目名称
 * @param {*} PC package.json文件
 */
export const initAndCloneProject = (PN, PC = {}) => {
    let init = '';
    init = new Promise((resolve, reject) => {
        const packagePath = `${PN}/package.json`;
        const packageContent = fs.readFileSync(packagePath, 'utf-8');
        const packageFinalValue = Handlebars.compile(packageContent)(PC, { name: PN });
        console.log(chalk.green(packageFinalValue));
        fs.writeFileSync(packagePath, packageFinalValue);
        console.log(logSymbols.success, '🛫️ 初始化项目成功');
        resolve();
    });
    return init;
};


/**
 * @function downloadTemplate 下载项目
 * @param {*} TN 模板名称
 * @param {*} PN 项目自定义名称 函数会根据自定义名称进行项目重命名
 * @returns
 */
export const downloadTemplate = (TN = '', PN = '') => {
    const spinner = ora('模板获取中...').start();
    const { downloadUrl } = templateObject[TN];
    let down = '';
    if (downloadUrl) {
        console.log(downloadUrl)
        down = new Promise((resolve, reject) => {
            setTimeout(() => {
                spinner.color = 'green';
                spinner.text = '模板链接获取成功，开始下载..';
            }, 1000);
            download(downloadUrl, PN || TN, { clone: true }, (error) => {
                if (error) {
                    spinner.color = 'red';
                    spinner.text = `模板获取失败，请重新操作,失败原因：${error}`;
                    spinner.fail();
                    reject(error);
                    return;
                }
                spinner.color = 'green';
                spinner.text = '🎉🎉🎉🎉🎉 模板下载成功';
                spinner.succeed();
                resolve(PN || TN);
            })
        })
    } else {
        spinner.color = 'red';
        spinner.text = '链接获取失败，请重新获取';
    }
    return down;
}

/**
 * @function descriptionNextStep 描述最后应该的步骤
 * @param {*} name 项目或者模板名称
 */
export const descriptionNextStep = (name) => {
    //TODO: 
    console.log(chalk.green(`cd ${name}`))
    console.log(chalk.green(`npm install`))
}