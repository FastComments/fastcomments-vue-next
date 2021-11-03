module.exports = {
  lang: 'en-US',
  title: 'FastComments for Vue 3',
  description: 'The FastComments Vue 3 component library',

  themeConfig: {
    docsDir: 'docs',
    sidebar: [
      {
        text: 'Introduction',
        link: '/',
      },
      {
        text: 'Components',
        children: getComponents(),
      },
    ],
  },
}

function getComponents() {
  return [
    { text: 'FastComments', link: '/guide/fastcomments/fastcomments' },
    { text: 'FastCommentsLiveChat', link: '/guide/fastcomments-live-chat/fastcomments-live-chat' },
  ]
}
