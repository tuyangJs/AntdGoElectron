import { defineConfig } from "umi";

export default defineConfig({
  plugins: ['./umiPlugin/plugin'],
  title: '笔耕',
  routes: [
    {
      path: "/",
      component: "index",

      layout: false,
    },
    { path: '/*', component: '404', },
    {
      path: '/uers',
      component: '@/layouts/index',
      layout: false,
      routes: [
        { path: "/uers/read/", component: "home", },
        {
          path: "/uers/set", component: "setweb",

        },
        { path: '/uers/about', component: "about" },
        { path: '/uers/me', component: "account" }

      ],
    }
  ],
  npmClient: 'cnpm',

});
