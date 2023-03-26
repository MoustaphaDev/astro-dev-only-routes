<h1 align="center">Astro Dev-only Routes 🚀</h1>
<h4 align="center">Make some routes only available in dev mode</h4>

<p align="center">
    <a href="https://github.com/MoustaphaDev/astro-dev-only-routes/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/MoustaphaDev/astro-dev-only-routes?style=flat-square" alt="astro-dev-only-routes licence" />
    </a>
    <a href="https://github.com/MoustaphaDev/astro-dev-only-routes/issues" target="_blank">
        <img src="https://img.shields.io/github/issues/MoustaphaDev/astro-dev-only-routes?style=flat-square" alt="astro-dev-only-routes issues"/>
    </a>
    <a href="https://github.com/MoustaphaDev/astro-dev-only-routes/pulls" target="_blank">
        <img src="https://img.shields.io/github/issues-pr/MoustaphaDev/astro-dev-only-routes?style=flat-square" alt="astro-dev-only-routes pull-requests"/>
    </a>
    <a href="https://github.com/MoustaphaDev/astro-dev-only-routes/stargazers" target="_blank">
        <img src="https://img.shields.io/github/stars/MoustaphaDev/astro-dev-only-routes?style=flat-square" alt="astro-dev-only-routes stars"/>
    </a>
    <a href="https://npmjs.com/package/astro-dev-only-routes" target="_blank">
        <img src="https://img.shields.io/npm/dt/astro-dev-only-routes.svg" alt="astro-dev-only-routes total downloads" />
    </a>
</p>

<p align="center">
    <a href="https://stackblitz.com/github/MoustaphaDev/astro-dev-only-routes/tree/main/demo" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/MoustaphaDev/astro-dev-only-routes/issues/new/choose" target="_blank">Report Bug</a>
</p>



<!-- TOC start -->
# Table of contents
- [Table of contents](#table-of-contents)
  - [Why `astro-dev-only-routes`?](#why-astro-dev-only-routes)
  - [🚀 Demo](#-demo)
  - [💻 Quickstart](#-quickstart)
  - [🛡️ License](#️-license)
  - [🗺️ Roadmap](#️-roadmap)
  - [🙏 Support](#-support)
<!-- TOC end --><!-- Generated with https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one -->

## Why `astro-dev-only-routes`?
Astro is a great tool for building static websites. However, it doesn't have a way to make some routes only available in dev mode, which could be useful for debugging or testing.

`astro-dev-only-routes` is an [Astro](https://astro.build/) integration that allows you to make some routes only available in dev mode.

<strong style="font-size:2rem">Many Thanks to all the `Stargazers`</strong>

[![Stargazers repo roster for astro-dev-only-routes](https://reporoster.com/stars/MoustaphaDev/astro-dev-only-routes)](https://github.com/MoustaphaDev/astro-dev-only-routes/stargazers)

## 🚀 Demo
Try out the minimal demo.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/MoustaphaDev/astro-dev-only-routes/tree/main/demo)

## 💻 Quickstart

To get started, you can install `astro-dev-only-routes` with the `astro add` CLI tool
```sh
# Using NPM
npx astro add astro-dev-only-routes

# Using YARN
yarn astro add astro-dev-only-routes

# Using PNPM
pnpm astro add astro-dev-only-routes
```

Now that you have installed the integration, you can add dev-only routes by prefixing the route with double underscores (`__`).

Create a new file in the `src/pages` directory and name it `__secret-page.astro`. This page will only be available in dev mode.
```astro
// src/pages/__secret-page.astro
---
console.log('This page is only available in dev mode.')
---
<h1>Secret Page</h1>
<p> This page is only available in dev mode. </p>
```

That's it! Now you can run `astro dev` and navigate to `http://localhost:3000/__secret-page` to see the page.
Try running `astro build` and you will see that the page is not included in the build.

## 🛡️ License
This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.

## 🗺️ Roadmap
These are the features that are planned for the future. If you have any suggestions, please open an issue.
None currently.

## 🙏 Support

If you liked this project, please give it a ⭐️. That's the best way you can support it!