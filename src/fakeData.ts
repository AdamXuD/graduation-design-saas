import pdfFile from '@/assets/files/test.pdf'
// import docFile from '@/assets/files/test.docx'
import pngFile from '@/assets/files/homework.png'
import avatar from '@/assets/picture/avatar.jpg'

export const allLesson = [
  {
    name: '多媒体通信技术',
    lesson_id: 'LE000001',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '光纤通信',
    lesson_id: 'LE000002',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '李四',
      id: 'TE000002'
    },
    isOver: true
  },
  {
    name: '信号检测与估计',
    lesson_id: 'LE000003',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '王五',
      id: 'TE000003'
    },
    isOver: false
  },
  {
    name: '信息与编码',
    lesson_id: 'LE000004',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '赵六',
      id: 'TE000004'
    },
    isOver: true
  },
  {
    name: '移动通信技术',
    lesson_id: 'LE000005',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '孙七',
      id: 'TE000005'
    },
    isOver: true
  },
  {
    name: '语音信号处理',
    lesson_id: 'LE000006',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '周八',
      id: 'TE000006'
    },
    isOver: true
  },
  {
    name: '电路CAD',
    lesson_id: 'LE000007',
    during: {
      year: 2022,
      semester: 1
    },
    teacher: {
      name: '吴九',
      id: 'TE000007'
    },
    isOver: true
  },
  {
    name: '通信工程毕业设计',
    lesson_id: 'LE000008',
    during: {
      year: 2022,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: false
  },
  {
    name: '通信工程毕业实习',
    lesson_id: 'LE000009',
    during: {
      year: 2022,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: false
  },
  {
    name: '计算机通信网络',
    lesson_id: 'LE000081',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '现代通信原理',
    lesson_id: 'LE000082',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: 'CPLD/FPGA应用设计',
    lesson_id: 'LE000083',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '程控交换技术A',
    lesson_id: 'LE000084',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '微机原理及应用F',
    lesson_id: 'LE000085',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '单片机原理及应用F',
    lesson_id: 'LE000086',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '图像处理A',
    lesson_id: 'LE000087',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  },
  {
    name: '微波技术与天线A',
    lesson_id: 'LE000088',
    during: {
      year: 2021,
      semester: 2
    },
    teacher: {
      name: '张三',
      id: 'TE000001'
    },
    isOver: true
  }
]

export const semester = {
  year: 2022,
  semester: 1
}

// status 0: 未完成 1: 已完成 2:已批改 3: 已逾期
export const tasks = [
  {
    task_id: 'TA000001',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '第一次作业',
    deadline: new Date().getTime() / 1000 + 86400,
    status: 0,
    text: '',
    files: [],
    score: -1
  },
  {
    task_id: 'TA000002',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '第二次作业',
    deadline: new Date().getTime() / 1000 + 86400,
    status: 1,
    text: '如图所示',
    files: [pdfFile, pngFile],
    score: -1
  },
  {
    task_id: 'TA000003',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '课后小测',
    deadline: 1677608678,
    status: 1,
    text: '',
    files: [pdfFile, pngFile],
    score: -1
  },
  {
    task_id: 'TA000004',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '第三次作业',
    deadline: 1677695078,
    status: 1,
    text: '',
    files: [pdfFile, pngFile],
    score: -1
  },
  {
    task_id: 'TA000005',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '第四次作业',
    deadline: 1677681478,
    status: 2,
    text: '如图所示',
    files: [pdfFile, pngFile],
    score: 80
  },
  {
    task_id: 'TA000006',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '课后小测',
    deadline: 1676781478,
    status: 2,
    text: '',
    files: [pdfFile, pngFile],
    score: 40
  },
  {
    task_id: 'TA000007',
    lesson_id: 'LE000003',
    lesson: '信号检测与估计',
    type: 'homework',
    title: '第五次作业',
    deadline: 1676781478,
    status: 3,
    text: '',
    files: [],
    score: 0
  }
]

export const dynamics = [
  {
    lesson: '多媒体通信技术',
    lesson_id: 'LE000001',
    teacher: '张三',
    content:
      '你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。',
    time: 1677835878
  },
  {
    lesson: '多媒体通信技术',
    lesson_id: 'LE000001',
    teacher: '张三',
    content:
      '你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。',
    time: 1677835878
  },
  {
    lesson: '多媒体通信技术',
    lesson_id: 'LE000001',
    teacher: '张三',
    content:
      '你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。你的作业已经提交成功，你的作业得分为 100 分。',
    time: 1677835878
  }
]

export const notices = [
  {
    title: '开课公告',
    content:
      '人类社会的运转与发展，离不开信息的传输。“通信原理”课程将为你解开信息是如何在各类通信系统中实现高效而可靠传输的“奥秘”。“通信原理”慕课即将开课，期待您的加入！',
    time: 1677835878
  },
  {
    title: '关于课程内容发布的说明',
    content:
      '各位同学，大家好！\r\n在讨论区收到多位同学询问后续课程内容的发布时间，按照课程大纲安排，第一章、第四章教学内容的课时均为1周，而第五章、第六章、第七章的课时为两周，按照开课时间和上述各章的课时安排，目前还未到发布后续章节的时间。但是考虑到国内疫情当前，为了方便同学们在线学习本课程的内容，课程组经过讨论后决定提前发布第六章和第七章的教学内容。',
    time: 1677835878
  },
  {
    title: '关于期末考试及下一期课程安排的公告',
    content:
      '各位同学：\n       大家好！感谢大家一直以来对本课程的关注与支持。依照课程大纲中安排的课程进度，这一期的《通信原理》课程将在本月底结束。为了帮助大家评估自己的学习效果，本课程的期末考试将在3月28日发布。请各位同学按时参加期末考试，为完成本课程的学习画上一个完满的句号。\n       另外， 为满足一些兄弟院校的教学需要以及一些同学的学习需求，本课程的下一期将在2020年4月1日开课，请有需要的同学关注本课程下一期的开课时间。\n       谢谢大家！',
    time: 1585184000
  },
  {
    title: '关于课程内容发布的说明',
    content:
      '各位同学：\n     大家好！在此就讨论区大家关注的一些问题进行说明如下：\n      本MOOC课程教学时数为48学时/12周，讲授和考核的内容请详见课程介绍页中的“课程大纲”。\n      1. 关于第2、3章的内容\n      第2章（确知信号）和第3章（随机过程）的内容分别属于先修课程《信号与系统》和《随机信号分析》，考虑到本课程的课时安排，这两章的内容由同学们自学完成。\n      2. 关于第8、11章的内容\n      第8章（新型数字带通调制技术》和第11章 （差错控制编码），因学时限制，这两章不在讲授和测试范围内。但为了方便有需求的同学自学，将发布这两章的教学课件供大家参考。\n      3. 后续章节的内容\n      由于疫情的原因和人员的隔离，视频后期制作和剪辑条件受到了极大的限制和影响。第9章（数字信号的最佳接收）、第10章（信源编码）和第13章（同步原理）的教学视频将以录播的方式呈现，并按照课程进度及时进行发布。请同学们理解，谢谢大家。',
    time: 1585184000
  },
  {
    title: '关于重新发布单元测试的说明',
    content:
      '各位同学：\n       大家好！非常感谢大家一直以来对本课程的关注。受疫情影响，一些兄弟高校采用了本课程进行《通信原理》的授课，但由于开课时间的限制，使得一些同学错过了部分单元的测试。经课程组讨论，我们将重新发布第5章~第7章的单元测试，供同学们检验自己的学习效果，并适当延长测试的截至时间。重新发布的单元测试不会影响已经完成测试同学的成绩，请大家理解，谢谢！',
    time: 1585184000
  },
  {
    title: '关于后续发布课程内容的说明',
    content:
      '各位同学：\n    大家好！非常感谢各位同学一直以来对本课程的关注。受到疫情影响，我们在完成第九章课程内容制作的过程中遇到一些当前环境下无法解决的技术问题和条件限制，为了不耽误大家的学习进度，同时保证课程内容的质量，曹丽娜教授采用录屏的方式录制了第九章的课程内容，随后会上传至平台。敬请大家谅解。',
    time: 1585184000
  }
]

/*
 * type:
 * classbegin: 课程开始
 * attendance: 签到
 * taketheroll: 点名
 * classend: 课程结束
 */
export const interactiveRecords = [
  {
    type: 'classbegin',
    time: 1677917400,
    data: null
  },
  {
    type: 'attendance',
    time: 1677917700,
    data: {
      late: false,
      order: 15
    }
  },
  {
    type: 'attendance',
    time: 1677917700,
    data: {
      late: true,
      order: 35
    }
  },
  {
    type: 'taketheroll',
    time: 1677918600,
    data: {
      multi: false,
      isTarget: false,
      question: ''
    }
  },
  {
    type: 'taketheroll',
    time: 1677918600,
    data: {
      multi: true,
      isTarget: false,
      question: ''
    }
  },
  {
    type: 'taketheroll',
    time: 1677918600,
    data: {
      multi: false,
      isTarget: true,
      question: ''
    }
  },
  {
    type: 'taketheroll',
    time: 1677918600,
    data: {
      multi: false,
      isTarget: false,
      question: ''
    }
  },
  {
    type: 'taketheroll',
    time: 1677918600,
    data: {
      multi: true,
      isTarget: false,
      question: ''
    }
  },
  {
    type: 'taketheroll',
    time: 1677918600,
    data: {
      multi: false,
      isTarget: true,
      question: ''
    }
  },
  {
    type: 'classend',
    time: 1677924000,
    data: null
  }
]

export const courseware = [
  {
    chapter: '第1章 绪论',
    children: [
      {
        chapter: '1.0 - 第0讲 导学篇|通信简介',
        content: [
          {
            title: '1.0 - 第0讲 导学篇|通信简介',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '1.1 - 第1讲 通信系统的组成',
        content: [
          {
            title: '1.1 - 第1讲 通信系统的组成',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '1.2 - 第2讲 系统分类和通信方式',
        content: [
          {
            title: '1.2 - 第2讲 系统分类和通信方式',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '1.3 - 第3讲 信息的度量',
        content: [
          {
            title: '1.3 - 第3讲 信息的度量',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '1.4 - 第4讲 通信系统的性能指标',
        content: [
          {
            title: '1.4 - 第4讲 通信系统的性能指标',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      }
    ]
  },
  {
    chapter: '第4章 信道与噪声',
    children: [
      {
        chapter: '4.0 - 第0讲 导学篇|信道简介',
        content: [
          {
            title: '4.0 - 第0讲 导学篇|信道简介',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '4.1 - 第1讲 狭义信道',
        content: [
          {
            title: '4.1 - 第1讲 狭义信道',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '4.2 - 第2讲 信道的数学模型',
        content: [
          {
            title: '4.2 - 第2讲 信道的数学模型',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '4.3 - 第3讲 信道的特性与影响',
        content: [
          {
            title: '4.3 - 第3讲 信道的特性与影响',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '4.4 - 第4讲 信道噪声',
        content: [
          {
            title: '4.4 - 第4讲 信道噪声',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      },
      {
        chapter: '4.5 - 第5讲 信道容量',
        content: [
          {
            title: '4.5 - 第5讲 信道容量',
            type: 'video',
            src: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
          }
        ]
      }
    ]
  }
]

export const cloudFileList = [
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c123c9b1c',
    name: '第1章 绪论',
    type: 'folder',
    modified_time: 1677835878,
    src: '',
    size: 0
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1cdsac9b1c',
    name: '第2章 信号与系统',
    type: 'folder',
    modified_time: 1677835878,
    src: '',
    size: 0
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1cxcsc9b1c',
    name: '第3章 信号的传输',
    type: 'folder',
    modified_time: 1677835878,
    src: '',
    size: 0
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4yrf1c',
    name: '第4章 信道与噪声',
    type: 'folder',
    modified_time: 1677835878,
    src: '',
    size: 0
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1bdvsa1c9b1c',
    name: '第5章 信号的调制与解调.ppt',
    type: 'file',
    modified_time: 1677835878,
    src: pdfFile,
    size: 1024
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    name: '第6章 信号的调制与解调.ppt',
    type: 'file',
    modified_time: 1677835878,
    src: pdfFile,
    size: 1024
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    name: '第7章 信号的调制与解调.ppt',
    type: 'file',
    modified_time: 1677835878,
    src: pdfFile,
    size: 1024
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    name: '第8章 信号的调制与解调.ppt',
    type: 'file',
    modified_time: 1677835878,
    src: pdfFile,
    size: 1024
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    name: '第9章 信号的调制与解调.ppt',
    type: 'file',
    modified_time: 1677835878,
    src: pdfFile,
    size: 1024
  }
]

export const personalInfo = {
  name: '张三',
  student_id: '201800000000',
  perfession: '计算机科学与技术',
  grade: '2018级',
  email: 'test@test.com',
  phone: '12345678901',
  introduction: '这个人很懒，什么都没有留下。',
  avatar
}

export const message = [
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    from: '张三',
    content: '同学，请按时完成作业。同学，请按时完成作业。同学，请按时完成作业。',
    time: 1677835878,
    isRead: false
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    from: '李四',
    content: '你好，我是李四。同学，请按时完成作业。',
    time: 1677835878,
    isRead: false
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    from: '王五',
    content: '你好，我是王五。同学，请按时完成作业。',
    time: 1677835878,
    isRead: false
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    from: '赵六',
    content: '你好，我是赵六。同学，请按时完成作业。',
    time: 1677835878,
    isRead: false
  },
  {
    id: '5f9f1b1c-1b1c-4b1c-9b1c-1b1c4b1c9b1c',
    from: '孙七',
    content: '你好，我是孙七。同学，请按时完成作业。',
    time: 1677835878,
    isRead: false
  }
]
