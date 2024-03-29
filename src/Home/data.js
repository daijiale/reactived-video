export const header = [
  {
    title: '',
    children: [
      {
        title: '', desc: '', img: '', link: '', top: '2px',
      },
    ],
  },
];
export const banner = [
  {
    img: 'https://notecdn.yiban.io/cloud_res_dev/87312400/imgs/19-1-11_21:39:17.690_67639.jpeg',
    imgMobile: 'https://gw.alipayobjects.com/zos/rmsportal/ksMYqrCyhwQNdBKReFIU.svg',
    className: 'seeconf-wrap',
    children: [
      { children: 'Seeking Experience & Engineering Conference', className: 'seeconf-en-name' },
      { children: '', className: 'seeconf-title', tag: 'h1' },
      { children: '', className: 'seeconf-cn-name' },
      {
        children: '了解详细',
        className: 'banner-button',
        tag: 'button',
        link: '',
      },
      { children: '', className: 'seeconf-time' },
    ],
  },
  {
    img: 'https://notecdn.yiban.io/cloud_res_dev/87312400/imgs/19-1-11_21:40:19.712_97503.jpeg',
    imgMobile: 'https://gw.alipayobjects.com/zos/rmsportal/ksMYqrCyhwQNdBKReFIU.svg',
    className: 'seeconf-wrap',
    children: [
      { children: 'Seeking Experience & Engineering Conference', className: 'seeconf-en-name' },
      { children: '', className: 'seeconf-title', tag: 'h1' },
      { children: '', className: 'seeconf-cn-name' },
      {
        children: '了解详细',
        className: 'banner-button',
        tag: 'button',
        link: '',
      },
      { children: '', className: 'seeconf-time' },
    ],
  },
  {
    img: 'https://notecdn.yiban.io/cloud_res_dev/87312400/imgs/19-1-11_21:40:14.565_2332.jpeg',
    imgMobile: 'https://placehold.it/200x300',
    className: 'seeconf-wrap',
    children: [
      { children: 'Seeking Experience & Engineering Conference', className: 'seeconf-en-name' },
      { children: '', className: 'seeconf-title', tag: 'h1' },
      { children: '', className: 'seeconf-cn-name' },
      {
        children: '',
        className: 'banner-button',
        tag: 'button',
        link: 'https://seeconf.alipay.com/',
      },
      { children: '', className: 'seeconf-time' },
    ],
  },
];

export const page1 = {
  title: '产品特性',
  children: [
    {
      title: '交互式体验',
      content: '超过30+分支选择，400+分支剧情，10余+经典结局，比肩原版电影的互动体验',
      src: 'https://gw.alipayobjects.com/zos/rmsportal/KtRzkMmxBuWCVjPbBgRY.svg',
      color: '#EB2F96',
      shadowColor: 'rgba(166, 55, 112, 0.08)',
    },
    {
      title: '一键观看',
      content: '无需科学上网、无需注册会员，在世界各处即可观看',
      src: 'https://gw.alipayobjects.com/zos/rmsportal/qIcZMXoztWjrnxzCNTHv.svg',
      color: '#1890FF',
      shadowColor: 'rgba(15, 93, 166, 0.08)',
    },
    {
      title: '价格实惠',
      content: '全集只要￥9.9，支持支付宝/微信支付',
      src: 'https://gw.alipayobjects.com/zos/rmsportal/eLtHtrKjXfabZfRchvVT.svg',
      color: '#AB33F7',
      shadowColor: 'rgba(112, 73, 166, 0.08)',
    },
  ],
};

export const page3 = {
  title: '电影正片',
  children: [
    {
      img: 'https://career-pic.oss-cn-beijing.aliyuncs.com/blackmirror/pc-poster.svg',
      imgMobile: 'https://career-pic.oss-cn-beijing.aliyuncs.com/blackmirror/mobile-poster.svg',
      src: 'https://192.168.5.141:8080/play_video/1/main.m3u8',
    },
  ],
};

export const page4 = {
  title: '',
  children: [
  ],
};

export const footer = [

];

// 图处预加载；
if (typeof document !== 'undefined') {
  const div = document.createElement('div');
  div.style.display = 'none';
  document.body.appendChild(div);
  [
  ].concat(page4.children).forEach((src) => {
    const img = new Image();
    img.src = src;
    div.appendChild(img);
  });
}
