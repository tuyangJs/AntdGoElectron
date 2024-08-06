import { IApi } from 'umi';
import Lodjs from '@/assets/light.svg'
export default (api: IApi) => {
    api.modifyHTML(($) => {
        return $;
    });

    api.addHTMLScripts(() => [`
    document.title = "正在加载";
    document.querySelector("#root").innerHTML='<h1>正在加载</h1>'
    `]);
    api.onDevCompileDone((opts) => {
        opts;
        // console.log('> onDevCompileDone', opts.isFirstCompile);
    });
    api.onBuildComplete((opts) => {
        opts;
        // console.log('> onBuildComplete', opts.isFirstCompile);
    });
    api.chainWebpack((memo) => {
        memo;
    });
    api.onStart(() => { });
    api.onCheckCode((args) => {
        args;
        // console.log('> onCheckCode', args);
    });
};