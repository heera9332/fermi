import localFont from 'next/font/local'

export const clashDisplay = localFont({
  src: [
    {
      path: '../../public/assets/fonts/clash-display/ClashDisplay-Extralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/clash-display/ClashDisplay-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/clash-display/ClashDisplay-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/clash-display/ClashDisplay-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/clash-display/ClashDisplay-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/clash-display/ClashDisplay-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})
