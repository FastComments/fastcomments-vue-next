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
    { text: 'FastCommentsCollabChat', link: '/guide/fastcomments-collab-chat/fastcomments-collab-chat' },
    { text: 'FastCommentsImageChat', link: '/guide/fastcomments-image-chat/fastcomments-image-chat' },
    { text: 'FastCommentsLiveChat', link: '/guide/fastcomments-live-chat/fastcomments-live-chat' },
  ]
}
