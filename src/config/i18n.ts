/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:38:14
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-12-17 16:18:13
 */

import * as i18n from 'i18next'
import * as LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule, } from 'react-i18next'

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    keySeparator: false,
    react: {
      wait: false,
    },
  })

export default i18n
