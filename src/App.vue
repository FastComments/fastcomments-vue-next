<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import FastCommentsWidget from './components/fastcomments.vue';
import FastCommentsCommentCount from './components/fastcomments-comment-count.vue';
import FastCommentsLiveChat from './components/fastcomments-live-chat.vue';
import FastCommentsCollabChat from './components/fastcomments-collab-chat.vue';
import FastCommentsImageChat from './components/fastcomments-image-chat.vue';
import FastCommentsRecentComments from './components/fastcomments-recent-comments.vue';
import FastCommentsRecentDiscussions from './components/fastcomments-recent-discussions.vue';
import FastCommentsReviewsSummary from './components/fastcomments-reviews-summary.vue';
import FastCommentsTopPages from './components/fastcomments-top-pages.vue';
import FastCommentsUserActivityFeed from './components/fastcomments-user-activity-feed.vue';

type Theme = 'light' | 'dark';
const THEME_KEY = 'fc-showcase-theme';

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const fromAttr = document.documentElement.getAttribute('data-fc-theme');
  if (fromAttr === 'light' || fromAttr === 'dark') return fromAttr;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const theme = ref<Theme>(readInitialTheme());

function setTheme(next: Theme) {
  theme.value = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_KEY, next);
    window.localStorage.setItem(THEME_KEY + ':user-set', '1');
  }
}

onMounted(() => {
  document.documentElement.dataset.fcTheme = theme.value;
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
  mq?.addEventListener?.('change', (e) => {
    if (!window.localStorage.getItem(THEME_KEY + ':user-set')) {
      theme.value = e.matches ? 'dark' : 'light';
    }
  });
});

watch(theme, (v) => {
  if (typeof document !== 'undefined') document.documentElement.dataset.fcTheme = v;
  if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, v);
});

const isDark = computed(() => theme.value === 'dark');

type ExampleKey =
  | 'comments' | 'comment-count' | 'live' | 'collab' | 'image'
  | 'recent-comments' | 'recent-discussions' | 'top-pages'
  | 'reviews-summary' | 'user-activity-feed'
  | 'callbacks' | 'dark-mode' | 'eu' | 'paginated' | 'simple-sso' | 'secure-sso';

type Example = {
  key: ExampleKey;
  label: string;
  hint: string;
  kind: 'widget' | 'flow';
};

const EXAMPLES: Example[] = [
  { key: 'comments', label: 'Live Comment Widget', hint: 'Full live commenting widget', kind: 'widget' },
  { key: 'comment-count', label: 'Comment Count', hint: 'Inline count badge', kind: 'widget' },
  { key: 'live', label: 'Live Chat', hint: 'Realtime streaming variant', kind: 'widget' },
  { key: 'collab', label: 'Collab Chat', hint: 'Text-anchored discussion', kind: 'widget' },
  { key: 'image', label: 'Image Chat', hint: 'Region comments on images', kind: 'widget' },
  { key: 'recent-comments', label: 'Recent Comments', hint: 'Cross-site comment stream', kind: 'widget' },
  { key: 'recent-discussions', label: 'Recent Discussions', hint: 'Most active threads', kind: 'widget' },
  { key: 'top-pages', label: 'Top Pages', hint: 'Pages ranked by activity', kind: 'widget' },
  { key: 'reviews-summary', label: 'Reviews Summary', hint: 'Star ratings overview', kind: 'widget' },
  { key: 'user-activity-feed', label: 'Activity Feed', hint: 'Per-user timeline', kind: 'widget' },
  { key: 'callbacks', label: 'Event Callbacks', hint: 'Lifecycle events mirrored live', kind: 'flow' },
  { key: 'dark-mode', label: 'Dark Mode', hint: 'Runtime theme switching', kind: 'flow' },
  { key: 'eu', label: 'EU Region', hint: 'Data residency via region flag', kind: 'flow' },
  { key: 'paginated', label: 'Thread Pagination', hint: 'Swap urlId at runtime', kind: 'flow' },
  { key: 'simple-sso', label: 'Simple SSO', hint: 'Unsigned identity', kind: 'flow' },
  { key: 'secure-sso', label: 'Secure SSO', hint: 'HMAC-signed identity', kind: 'flow' },
];

const selected = ref<ExampleKey>('comments');

const current = computed(() => EXAMPLES.find((e) => e.key === selected.value) ?? EXAMPLES[0]);
const widgets = computed(() => EXAMPLES.filter((e) => e.kind === 'widget'));
const flows = computed(() => EXAMPLES.filter((e) => e.kind === 'flow'));

const demoConfig = computed(() => ({ tenantId: 'demo', urlId: 'vue-next-demo', hasDarkBackground: isDark.value }));
const tenantConfig = computed(() => ({ tenantId: 'demo', hasDarkBackground: isDark.value }));
const darkModeConfig = computed(() => ({ tenantId: 'demo', urlId: 'vue-next-demo', hasDarkBackground: isDark.value }));
const commentCountConfig = computed(() => ({ tenantId: 'demo', urlId: 'vue-next-demo-count', hasDarkBackground: isDark.value }));
const reviewsSummaryConfig = computed(() => ({ tenantId: 'demo', urlId: 'demo-ratings', hasDarkBackground: isDark.value }));
const userActivityFeedConfig = computed(() => ({ tenantId: 'demo', userId: 'demo:someone@somewhere.com', hasDarkBackground: isDark.value }));

// Callbacks flow state
type LogEvent = { id: number; name: string; payload: string; at: string };
const events = ref<LogEvent[]>([]);
let eventSeq = 0;
function track(name: string, payload: unknown) {
  const pretty = typeof payload === 'string' ? payload : JSON.stringify(payload).slice(0, 220);
  events.value = [{ id: ++eventSeq, name, payload: pretty, at: new Date().toLocaleTimeString() }, ...events.value].slice(0, 40);
  console.log(`Callback: ${name}`, payload);
}
const callbacksConfig = computed(() => ({
  tenantId: 'demo',
  urlId: 'vue-next-demo-callbacks',
  hasDarkBackground: isDark.value,
  onInit: () => track('onInit', ''),
  onRender: () => track('onRender', ''),
  onCommentsRendered: (comments: unknown[]) => track('onCommentsRendered', `${comments.length} comments`),
  commentCountUpdated: (count: number) => track('commentCountUpdated', `count=${count}`),
  onAuthenticationChange: (event: string, data: unknown) => track('onAuthenticationChange', { event, data }),
  onReplySuccess: (comment: unknown) => track('onReplySuccess', comment),
  onVoteSuccess: (_c: unknown, voteId: string, direction: number, status: unknown) => track('onVoteSuccess', { voteId, direction, status }),
  onCommentSubmitStart: (c: unknown, next: () => void) => { track('onCommentSubmitStart', c); next(); },
}));

// EU region
const euConfig = computed(() => ({ tenantId: 'demo', region: 'eu', urlId: 'vue-next-demo-eu', hasDarkBackground: isDark.value }));

// Pagination
const productId = ref(0);
const paginatedConfig = computed(() => ({ tenantId: 'demo', urlId: `vue-next-product-${productId.value}`, hasDarkBackground: isDark.value }));
function paginate(dir: -1 | 1) { productId.value += dir; }

// Simple SSO
const simpleSSOConfig = computed(() => ({
  tenantId: 'demo',
  urlId: 'vue-next-demo-simple-sso',
  hasDarkBackground: isDark.value,
  simpleSSO: {
    username: 'Someone',
    email: 'someone@somewhere.com',
    avatar: 'https://staticm.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
    websiteUrl: 'https://blog.fastcomments.com',
  },
}));

// Secure SSO
const secureSSO = ref<{ loginURL: string; logoutURL: string; userDataJSONBase64?: string; verificationHash?: string; timestamp?: number }>({
  loginURL: 'https://example.com/login',
  logoutURL: 'https://example.com/logout',
});
const secureSSOStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
async function loadSecureSSO() {
  secureSSOStatus.value = 'loading';
  try {
    const res = await fetch('http://localhost:3003/sso-user-info', { headers: { Accept: 'application/json' } });
    const info = await res.json();
    secureSSO.value = { ...secureSSO.value, ...info };
    secureSSOStatus.value = 'ready';
  } catch {
    secureSSOStatus.value = 'error';
  }
}
const secureSSOConfig = computed(() => ({
  tenantId: 'demo',
  urlId: 'vue-next-demo-secure-sso',
  hasDarkBackground: isDark.value,
  sso: secureSSO.value,
}));
watch(selected, (sel) => {
  if (sel === 'secure-sso' && secureSSOStatus.value === 'idle') loadSecureSSO();
});

const PKG = ['fastcomments', 'vue', 'next'].join('-');
const SNIPPETS: Record<ExampleKey, { label: string; code: string }> = {
  comments: {
    label: 'CommentWidget.vue',
    code: `\x3cscript setup lang="ts">
import { FastComments } from '${PKG}';
\x3c/script>

<template>
  <FastComments :config="{ tenantId: 'demo' }" />
</template>`,
  },
  live: {
    label: 'LiveChat.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsLiveChat } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsLiveChat :config="{ tenantId: 'demo' }" />
</template>`,
  },
  collab: {
    label: 'CollabChat.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsCollabChat } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsCollabChat :config="{ tenantId: 'demo' }">
    <p>Highlight any passage to pin a discussion.</p>
  </FastCommentsCollabChat>
</template>`,
  },
  image: {
    label: 'ImageChat.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsImageChat } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsImageChat :config="{ tenantId: 'demo' }">
    <img src="/your-image.jpg" alt="" />
  </FastCommentsImageChat>
</template>`,
  },
  'recent-comments': {
    label: 'RecentComments.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsRecentComments } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsRecentComments :config="{ tenantId: 'demo' }" />
</template>`,
  },
  'recent-discussions': {
    label: 'RecentDiscussions.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsRecentDiscussions } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsRecentDiscussions :config="{ tenantId: 'demo' }" />
</template>`,
  },
  'top-pages': {
    label: 'TopPages.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsTopPages } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsTopPages :config="{ tenantId: 'demo' }" />
</template>`,
  },
  'comment-count': {
    label: 'CommentCount.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsCommentCount } from '${PKG}';
\x3c/script>

<template>
  Comments:
  <FastCommentsCommentCount :config="{ tenantId: 'demo', urlId: 'my-page' }" />
</template>`,
  },
  'reviews-summary': {
    label: 'ReviewsSummary.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsReviewsSummary } from '${PKG}';
\x3c/script>

<template>
  <FastCommentsReviewsSummary :config="{ tenantId: 'demo', urlId: 'demo-ratings' }" />
</template>`,
  },
  'user-activity-feed': {
    label: 'UserActivityFeed.vue',
    code: `\x3cscript setup lang="ts">
import { FastCommentsUserActivityFeed } from '${PKG}';

// SSO userId format: \\\`\\\${tenantId}:\\\${appUserId}\\\`
\x3c/script>

<template>
  <FastCommentsUserActivityFeed
    :config="{ tenantId: 'demo', userId: 'demo:someone@somewhere.com' }"
  />
</template>`,
  },
  callbacks: {
    label: 'Callbacks.vue',
    code: `\x3cscript setup lang="ts">
import { FastComments } from '${PKG}';

const config = {
  tenantId: 'demo',
  urlId: 'callbacks-demo',
  onInit: () => console.log('onInit'),
  onRender: () => console.log('onRender'),
  onCommentsRendered: (c) => console.log('rendered', c.length),
  commentCountUpdated: (n) => console.log('count', n),
  onAuthenticationChange: (e, d) => console.log(e, d),
  onReplySuccess: (c) => console.log('reply', c),
  onVoteSuccess: (c, id, dir) => console.log('vote', dir),
  onCommentSubmitStart: (c, next) => next(),
};
\x3c/script>

<template>
  <FastComments :config="config" />
</template>`,
  },
  'dark-mode': {
    label: 'DarkMode.vue',
    code: `\x3cscript setup lang="ts">
import { ref, computed } from 'vue';
import { FastComments } from '${PKG}';

const isDark = ref(false);
const config = computed(() => ({ tenantId: 'demo', hasDarkBackground: isDark.value }));
\x3c/script>

<template>
  <button @click="isDark = false">Light</button>
  <button @click="isDark = true">Dark</button>
  <FastComments :config="config" />
</template>`,
  },
  eu: {
    label: 'EU.vue',
    code: `\x3cscript setup lang="ts">
import { FastComments } from '${PKG}';
\x3c/script>

<template>
  <FastComments :config="{ tenantId: 'demo', region: 'eu', urlId: 'demo-eu' }" />
</template>`,
  },
  paginated: {
    label: 'Paginated.vue',
    code: `\x3cscript setup lang="ts">
import { ref, computed } from 'vue';
import { FastComments } from '${PKG}';

const productId = ref(0);
const config = computed(() => ({ tenantId: 'demo', urlId: \`product-\${productId.value}\` }));
\x3c/script>

<template>
  <button @click="productId--">Prev</button>
  <button @click="productId++">Next</button>
  <FastComments :config="config" />
</template>`,
  },
  'simple-sso': {
    label: 'SimpleSSO.vue',
    code: `\x3cscript setup lang="ts">
import { FastComments } from '${PKG}';

const config = {
  tenantId: 'demo',
  urlId: 'demo-simple-sso',
  simpleSSO: {
    username: 'Someone',
    email: 'someone@somewhere.com',
    avatar: 'https://example.com/avatar.jpg',
  },
};
\x3c/script>

<template>
  <FastComments :config="config" />
</template>`,
  },
  'secure-sso': {
    label: 'SecureSSO.vue',
    code: `\x3cscript setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FastComments } from '${PKG}';

const sso = ref({
  loginURL: 'https://example.com/login',
  logoutURL: 'https://example.com/logout',
});

onMounted(async () => {
  // Your server HMAC-signs a base64 user payload
  const r = await fetch('/sso-user-info');
  const info = await r.json();
  sso.value = { ...sso.value, ...info };
});

const config = computed(() => ({ tenantId: 'demo', urlId: 'demo-secure-sso', sso: sso.value }));
\x3c/script>

<template>
  <FastComments :config="config" />
</template>`,
  },
};
const snippet = computed(() => SNIPPETS[selected.value]);

const copied = ref(false);
async function copyCode() {
  try {
    await navigator.clipboard.writeText(snippet.value.code);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1200);
  } catch (_) {}
}
</script>

<template>
  <div class="fc-shell">
    <aside class="fc-rail">
      <a class="fc-brand" href="#" @click.prevent="selected = 'comments'">
        <img class="fc-brand__logo fc-brand__logo--light" src="https://fastcomments.com/images/svg/v2/logo.svg" alt="FastComments" />
        <img class="fc-brand__logo fc-brand__logo--dark" src="https://fastcomments.com/images/svg/v2/logo_white.svg" alt="" aria-hidden="true" />
        <span class="fc-brand__wordmark">
          <span class="fc-brand__name">FastComments</span>
          <span class="fc-brand__slug">vue 3 · showcase</span>
        </span>
      </a>

      <nav class="fc-nav" aria-label="Examples">
        <div class="fc-nav__group">
          <div class="fc-nav__heading"><span>01</span><em>Widgets</em></div>
          <a
            v-for="item in widgets"
            :key="item.key"
            href="#"
            class="fc-nav__item"
            :class="{ 'is-active': selected === item.key }"
            @click.prevent="selected = item.key"
          >
            <span class="fc-nav__item-label">{{ item.label }}</span>
            <span class="fc-nav__item-hint">{{ item.hint }}</span>
          </a>
        </div>

        <div class="fc-nav__group">
          <div class="fc-nav__heading"><span>02</span><em>Flows &amp; configuration</em></div>
          <a
            v-for="item in flows"
            :key="item.key"
            href="#"
            class="fc-nav__item"
            :class="{ 'is-active': selected === item.key }"
            @click.prevent="selected = item.key"
          >
            <span class="fc-nav__item-label">{{ item.label }}</span>
            <span class="fc-nav__item-hint">{{ item.hint }}</span>
          </a>
        </div>
      </nav>

      <footer class="fc-rail__foot">
        <div class="fc-theme-toggle" role="group" aria-label="Theme">
          <button type="button" class="fc-theme-toggle__btn" :class="{ 'is-active': theme === 'light' }" @click="setTheme('light')">Light</button>
          <button type="button" class="fc-theme-toggle__btn" :class="{ 'is-active': theme === 'dark' }" @click="setTheme('dark')">Dark</button>
        </div>
        <div><code>npm i fastcomments-vue-next</code></div>
        <a href="https://fastcomments.com" rel="noopener">fastcomments.com &nearr;</a>
      </footer>
    </aside>

    <main class="fc-stage">
      <div class="fc-demo">
        <header class="fc-demo__head">
          <div>
            <div class="fc-demo__breadcrumb">
              {{ current.kind === 'widget' ? 'Widgets' : 'Flows' }} <em>/ {{ current.label }}</em>
            </div>
            <h1 class="fc-demo__title">{{ current.label }}</h1>
            <p class="fc-demo__subtitle">{{ current.hint }}</p>
          </div>
          <div class="fc-demo__actions">
            <span class="fc-tag fc-tag--brand">Tenant · demo</span>
            <span class="fc-tag">vue 3</span>
          </div>
        </header>

        <!-- widgets -->
        <div v-if="selected === 'comments'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsWidget :config="demoConfig" />
        </div>
        <div v-else-if="selected === 'comment-count'" class="fc-stage__panel fc-stage__panel--light">
          <div style="font-family: var(--fc-mono); font-size: 14px; color: var(--fc-ink);">
            Comments:
            <FastCommentsCommentCount :config="commentCountConfig" />
          </div>
        </div>
        <div v-else-if="selected === 'live'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsLiveChat :config="demoConfig" />
        </div>
        <div v-else-if="selected === 'collab'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsCollabChat :config="demoConfig">
            <p style="font-family: Georgia, serif; font-size: 17px; line-height: 1.7; color: #1e1e1e; max-width: 64ch;">
              Highlight any passage of this sample document to anchor a thread to the selection. Collab Chat pins the
              conversation to the exact text so reviewers share context when they reply.
            </p>
          </FastCommentsCollabChat>
        </div>
        <div v-else-if="selected === 'image'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsImageChat :config="demoConfig">
            <img src="https://staticm.fastcomments.com/1691111223541-DSC_0015.JPG" alt="Sample" style="max-width: 100%; display: block;" />
          </FastCommentsImageChat>
        </div>
        <div v-else-if="selected === 'recent-comments'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsRecentComments :config="tenantConfig" />
        </div>
        <div v-else-if="selected === 'recent-discussions'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsRecentDiscussions :config="tenantConfig" />
        </div>
        <div v-else-if="selected === 'top-pages'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsTopPages :config="tenantConfig" />
        </div>
        <div v-else-if="selected === 'reviews-summary'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsReviewsSummary :config="reviewsSummaryConfig" />
        </div>
        <div v-else-if="selected === 'user-activity-feed'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsUserActivityFeed :config="userActivityFeedConfig" />
        </div>

        <!-- flows -->
        <div v-else-if="selected === 'dark-mode'" class="fc-stage__panel">
          <div style="display: flex; gap: 10px; padding-bottom: 16px; box-shadow: inset 0 -1px 0 0 var(--fc-border); margin-bottom: 20px;">
            <button class="fc-btn" :class="{ 'fc-btn--primary': !isDark }" @click="setTheme('light')">Light</button>
            <button class="fc-btn" :class="{ 'fc-btn--primary': isDark }" @click="setTheme('dark')">Dark</button>
          </div>
          <div :style="{ padding: '24px', borderRadius: '12px', transition: 'background 250ms ease, color 250ms ease', background: isDark ? '#0b0b0b' : '#ffffff', color: isDark ? '#fff' : '#111' }">
            <FastCommentsWidget :config="darkModeConfig" />
          </div>
        </div>

        <div v-else-if="selected === 'callbacks'" style="display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr); gap: 18px;">
          <div class="fc-stage__panel fc-stage__panel--light" style="min-width: 0;">
            <FastCommentsWidget :config="callbacksConfig" />
          </div>
          <div class="fc-stage__panel" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-family: var(--fc-mono); font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fc-ink-mute);">
                <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #27be69; margin-right: 8px;"></span>
                Event log
              </span>
              <button class="fc-btn" style="padding: 6px 12px; font-size: 11px;" @click="events = []">clear</button>
            </div>
            <div class="fc-log">
              <span v-if="events.length === 0" class="fc-log__line">&gt; waiting for events...</span>
              <span v-for="e in events" :key="e.id" class="fc-log__line fc-log__line--in">
                [{{ e.at }}] {{ e.name }} <span style="color: var(--fc-ink-mute);">&middot; {{ e.payload }}</span>
              </span>
            </div>
          </div>
        </div>

        <div v-else-if="selected === 'eu'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsWidget :config="euConfig" />
        </div>

        <div v-else-if="selected === 'paginated'" class="fc-stage__panel" style="padding: 20px;">
          <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 14px; box-shadow: inset 0 -1px 0 0 var(--fc-border); margin-bottom: 20px; flex-wrap: wrap;">
            <button class="fc-btn" @click="paginate(-1)">← prev product</button>
            <button class="fc-btn fc-btn--primary" @click="paginate(1)">next product →</button>
            <div style="font-family: var(--fc-mono); font-size: 13px; color: var(--fc-ink-dim); margin-left: auto;">
              <span style="color: var(--fc-ink-mute);">product</span>
              <span style="color: var(--fc-ink);">&nbsp;#{{ productId }}</span>
            </div>
          </div>
          <div class="fc-stage__panel fc-stage__panel--light" style="padding: 20px;">
            <FastCommentsWidget :config="paginatedConfig" />
          </div>
        </div>

        <div v-else-if="selected === 'simple-sso'" class="fc-stage__panel fc-stage__panel--light">
          <FastCommentsWidget :config="simpleSSOConfig" />
        </div>

        <div v-else-if="selected === 'secure-sso'">
          <div v-if="secureSSOStatus === 'error'" class="fc-stage__panel" style="border-color: rgba(255, 59, 48, 0.5); background: rgba(255, 59, 48, 0.05); margin-bottom: 18px;">
            <div style="font-family: var(--fc-mono); font-size: 13px; color: #ff8b85;">
              Couldn't reach the example SSO server.<br />
              <span style="color: var(--fc-ink-mute);">
                Run <code>node-express</code> from
                <a href="https://github.com/fastcomments/fastcomments-code-examples" target="_blank" rel="noopener" style="color: var(--fc-accent-c); text-decoration: underline dashed;">fastcomments-code-examples</a>
                on port 3003 to continue.
              </span>
            </div>
          </div>
          <div class="fc-stage__panel fc-stage__panel--light">
            <FastCommentsWidget :config="secureSSOConfig" />
          </div>
        </div>

        <div class="fc-code-panel">
          <div class="fc-code-panel__head">
            <span class="fc-code-panel__head-label">{{ snippet.label }}</span>
            <button type="button" class="fc-code-panel__copy" @click="copyCode">{{ copied ? 'Copied' : 'Copy' }}</button>
          </div>
          <pre class="fc-code-panel__body">{{ snippet.code }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@font-face {
  font-family: "FastCommentsInter";
  src: url("https://fastcomments.com/fonts/Inter-VariableFont_slnt,wght.woff2") format("woff2"),
       url("https://fastcomments.com/fonts/Inter-VariableFont_slnt,wght.ttf") format("truetype");
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: "FastCommentsManrope";
  src: url("https://fastcomments.com/fonts/Manrope-VariableFont_wght.woff2") format("woff2"),
       url("https://fastcomments.com/fonts/Manrope-VariableFont_wght.ttf") format("truetype");
  font-weight: 200 800;
  font-display: swap;
}
:root {
  --fc-bg: #f7f7f8; --fc-panel: #ffffff; --fc-panel-raised: #f1f1f4;
  --fc-border: #e4e4e7; --fc-border-strong: #d4d4d8;
  --fc-ink: #0b0b0f; --fc-ink-dim: #4a4a52; --fc-ink-mute: #8a8a93;
  --fc-accent-a: #5356ec; --fc-accent-b: #8453ed; --fc-accent-c: #53b7ee;
  --fc-gradient: linear-gradient(65.68deg, #5356ec -11.59%, #8453ed 72.49%);
  --fc-gradient-soft: linear-gradient(65deg, rgba(83,86,236,0.18), rgba(132,83,237,0.18));
  --fc-success: #27be69;
  --fc-rail-w: 332px;
  --fc-display: "FastCommentsManrope", "Manrope", system-ui, sans-serif;
  --fc-body: "FastCommentsInter", "Inter", system-ui, sans-serif;
  --fc-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --fc-subtle: rgba(0,0,0,0.04);
  --fc-subtle-2: rgba(0,0,0,0.02);
  --fc-rail-tint: rgba(83,86,236,0.10);
  --fc-rail-grad-start: rgba(255,255,255,0.92);
  --fc-rail-grad-end: rgba(247,247,248,0.96);
  --fc-body-glow-a: rgba(83,86,236,0.08);
  --fc-body-glow-b: rgba(132,83,237,0.06);
  --fc-dot-color: rgba(0,0,0,0.05);
  --fc-light-panel-bg: #ffffff;
  --fc-light-panel-ink: #0b0b0f;
}
html[data-fc-theme="dark"] {
  --fc-bg: #030303; --fc-panel: #0d0d0d; --fc-panel-raised: #121212;
  --fc-border: #1f1f22; --fc-border-strong: #2a2a2f;
  --fc-ink: #fcfcfc; --fc-ink-dim: #a6a6a6; --fc-ink-mute: #686868;
  --fc-subtle: rgba(255,255,255,0.03);
  --fc-subtle-2: rgba(255,255,255,0.015);
  --fc-rail-tint: rgba(83,86,236,0.22);
  --fc-rail-grad-start: rgba(13,13,13,0.92);
  --fc-rail-grad-end: rgba(3,3,3,0.96);
  --fc-body-glow-a: rgba(83,86,236,0.14);
  --fc-body-glow-b: rgba(132,83,237,0.10);
  --fc-dot-color: rgba(255,255,255,0.04);
  --fc-light-panel-bg: #0b0b0b;
  --fc-light-panel-ink: #fcfcfc;
}
html, body { background: var(--fc-bg); color: var(--fc-ink); margin: 0; padding: 0; transition: background 200ms ease, color 200ms ease; }
body {
  font-family: var(--fc-body); -webkit-font-smoothing: antialiased;
  background-image:
    radial-gradient(900px 600px at 8% -10%, var(--fc-body-glow-a), transparent 60%),
    radial-gradient(800px 500px at 100% 100%, var(--fc-body-glow-b), transparent 55%),
    radial-gradient(circle at 1px 1px, var(--fc-dot-color) 1px, transparent 0);
  background-size: auto, auto, 24px 24px;
}
* { box-sizing: border-box; } a { color: inherit; text-decoration: none; }
.fc-shell { display: grid; grid-template-columns: var(--fc-rail-w) minmax(0, 1fr); min-height: 100vh; }
.fc-rail {
  position: sticky; top: 0; height: 100vh; padding: 28px 22px 22px;
  box-shadow: inset -1px 0 0 0 var(--fc-border);
  background:
    linear-gradient(180deg, var(--fc-rail-grad-start), var(--fc-rail-grad-end)),
    radial-gradient(500px 300px at 0% 0%, var(--fc-rail-tint), transparent 60%);
  backdrop-filter: blur(14px);
  display: flex; flex-direction: column; gap: 22px; overflow: hidden; min-height: 0;
  transition: background 200ms ease;
}
.fc-brand { display: flex; align-items: center; gap: 14px; }
.fc-brand__logo { width: 36px; height: 42px; display: block; }
.fc-brand__logo--dark { display: none; }
html[data-fc-theme="dark"] .fc-brand__logo--light { display: none; }
html[data-fc-theme="dark"] .fc-brand__logo--dark { display: block; }
.fc-brand__wordmark { display: flex; flex-direction: column; line-height: 1.1; }
.fc-brand__name { font-family: var(--fc-display); font-weight: 800; font-size: 17px; letter-spacing: -0.02em; color: var(--fc-ink); }
.fc-brand__slug { font-family: var(--fc-mono); font-size: 10px; color: var(--fc-ink-mute); text-transform: uppercase; letter-spacing: 0.22em; margin-top: 4px; }

.fc-nav { display: flex; flex-direction: column; gap: 24px; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-right: 4px; }
.fc-nav__group { display: flex; flex-direction: column; gap: 4px; }
.fc-nav__heading {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--fc-mono); font-size: 10.5px; text-transform: uppercase;
  letter-spacing: 0.2em; color: var(--fc-ink-mute); padding: 8px 10px 6px;
}
.fc-nav__heading span { color: var(--fc-accent-c); }
.fc-nav__heading em { font-style: normal; color: var(--fc-ink-dim); letter-spacing: 0.18em; }
.fc-nav__item {
  display: flex; flex-direction: column; gap: 4px;
  padding: 10px 12px; border: 1px solid transparent; border-radius: 10px;
  cursor: pointer; transition: background 180ms ease, border-color 180ms ease; position: relative;
}
.fc-nav__item:hover { background: var(--fc-subtle); border-color: var(--fc-border); }
.fc-nav__item-label { font-family: var(--fc-display); font-weight: 600; font-size: 14px; color: var(--fc-ink); letter-spacing: -0.01em; }
.fc-nav__item-hint { font-size: 12px; color: var(--fc-ink-mute); }
.fc-nav__item.is-active {
  background: linear-gradient(90deg, rgba(83,86,236,0.18), rgba(132,83,237,0.08) 70%, transparent);
  border-color: rgba(83,86,236,0.45);
}
.fc-nav__item.is-active .fc-nav__item-label { color: var(--fc-ink); }

.fc-rail__foot { display: flex; flex-direction: column; gap: 10px; padding-top: 14px; box-shadow: inset 0 1px 0 0 var(--fc-border); font-size: 11.5px; color: var(--fc-ink-mute); flex-shrink: 0; }
.fc-rail__foot code { font-family: var(--fc-mono); font-size: 11.5px; padding: 6px 9px; border-radius: 6px; background: var(--fc-subtle); color: var(--fc-ink-dim); display: inline-block; border: 1px solid var(--fc-border); }
.fc-rail__foot a { color: var(--fc-ink-dim); }
.fc-rail__foot a:hover { color: var(--fc-ink); }

.fc-stage { min-width: 0; padding: 44px clamp(28px, 6vw, 80px) 120px; position: relative; }

.fc-demo { display: flex; flex-direction: column; gap: 28px; }
.fc-demo__head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px; padding-bottom: 18px; box-shadow: inset 0 -1px 0 0 var(--fc-border); }
.fc-demo__breadcrumb { font-family: var(--fc-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--fc-ink-mute); display: inline-flex; align-items: center; gap: 10px; }
.fc-demo__breadcrumb em { color: var(--fc-ink); font-style: normal; }
.fc-demo__title { font-family: var(--fc-display); font-weight: 700; font-size: 30px; letter-spacing: -0.025em; margin: 10px 0 6px; color: var(--fc-ink); }
.fc-demo__subtitle { color: var(--fc-ink-dim); max-width: 64ch; line-height: 1.55; margin: 0; }
.fc-demo__actions { display: inline-flex; gap: 8px; flex-wrap: wrap; }
.fc-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; font-family: var(--fc-mono); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fc-ink-dim); border: 1px solid var(--fc-border-strong); border-radius: 999px; background: var(--fc-subtle-2); }
.fc-tag--brand { color: #fff; border-color: rgba(132,83,237,0.5); background: var(--fc-gradient-soft); }

.fc-stage__panel { border: 1px solid var(--fc-border); border-radius: 18px; padding: 28px; background: var(--fc-panel); color: var(--fc-ink); position: relative; overflow: hidden; transition: background 200ms ease, color 200ms ease; }
.fc-stage__panel--light { background: var(--fc-light-panel-bg); color: var(--fc-light-panel-ink); }

.fc-code-panel { border: 1px solid var(--fc-border); border-radius: 18px; background: var(--fc-panel); overflow: hidden; margin-top: 24px; }
.fc-code-panel__head { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 12px 18px; box-shadow: inset 0 -1px 0 0 var(--fc-border); font-family: var(--fc-mono); font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fc-ink-mute); }
.fc-code-panel__head-label { display: inline-flex; align-items: center; gap: 8px; }
.fc-code-panel__head-label::before { content: ""; width: 6px; height: 6px; border-radius: 1px; background: var(--fc-gradient); }
.fc-code-panel__copy { font-family: var(--fc-mono); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fc-ink-mute); background: transparent; border: 1px solid var(--fc-border-strong); border-radius: 999px; padding: 5px 10px; cursor: pointer; transition: color 150ms ease, border-color 150ms ease; }
.fc-code-panel__copy:hover { color: var(--fc-ink); border-color: rgba(132,83,237,0.55); }
.fc-code-panel__body { margin: 0; padding: 18px 22px; font-family: var(--fc-mono); font-size: 12.5px; line-height: 1.7; color: var(--fc-ink); background: var(--fc-bg); overflow-x: auto; white-space: pre; }

.fc-theme-toggle { display: inline-flex; padding: 3px; border: 1px solid var(--fc-border-strong); border-radius: 999px; background: var(--fc-subtle-2); align-self: flex-start; }
.fc-theme-toggle__btn { font-family: var(--fc-mono); font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fc-ink-mute); padding: 6px 12px; border-radius: 999px; background: transparent; border: none; cursor: pointer; transition: background 150ms ease, color 150ms ease; }
.fc-theme-toggle__btn.is-active { background: var(--fc-gradient); color: #fff; }

.fc-btn { display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px; font-family: var(--fc-display); font-weight: 600; font-size: 13.5px; border-radius: 10px; border: 1px solid var(--fc-border-strong); background: var(--fc-panel-raised); color: var(--fc-ink); cursor: pointer; transition: transform 150ms ease, border-color 150ms ease; }
.fc-btn:hover { transform: translateY(-1px); border-color: rgba(132,83,237,0.55); }
.fc-btn--primary { border-color: transparent; background: var(--fc-gradient); color: #fff; }

.fc-log {
  font-family: var(--fc-mono);
  font-size: 12px;
  line-height: 1.6;
  padding: 14px 16px;
  background: var(--fc-bg);
  border: 1px solid var(--fc-border);
  border-radius: 10px;
  max-height: 240px;
  overflow-y: auto;
  color: var(--fc-ink-dim);
}
.fc-log__line { display: block; }
.fc-log__line--in { color: var(--fc-ink); }

@media (max-width: 820px) {
  .fc-shell { grid-template-columns: 1fr; }
  .fc-rail { position: relative; height: auto; box-shadow: inset 0 -1px 0 0 var(--fc-border); }
  .fc-stage { padding: 32px 20px 80px; }
}
</style>
