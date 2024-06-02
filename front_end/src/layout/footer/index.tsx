import { defineComponent } from 'vue';

import { GithubOutlined, CopyrightOutlined } from '@ant-design/icons-vue';
import { Layout } from 'ant-design-vue';
import styles from './index.module.less';

const { Footer: ALayoutFooter } = Layout;

export default defineComponent({
  name: 'PageFooter',
  components: { ALayoutFooter },
  setup() {
    return () => (
      <>
        <a-layout-footer class={styles.page_footer}>
          <div class={styles.page_footer_link}>
            <a href="https://github.com/BaoDao-212" target="_blank">
              <GithubOutlined />
            </a>
            <a href="https://github.com/BaoDao-212/graduation_thesis" target="_blank">
              {' '}
              Source Code
            </a>
          </div>
          <div class={styles.copyright}>
            Copyright <CopyrightOutlined /> 2024
            <a href="https://github.com/BaoDao-212" target="_blank">
              Nguyen Hoang Bao
            </a>
          </div>
        </a-layout-footer>
      </>
    );
  },
});
