import { Resource, ResourceList, ResourcePost } from './classes'

const resourceData1: Resource[] = [
  {
    title: 'Erlangen-Angio-Tool (EA-Tool)',
    description: `A semi-automated tool coded in Matlab and designed as stand-alone software with a graphical user interface. The software applies the Frangi vesselness filter and Otsu thresholding algorithm for vessel segmentation. After uploading the OCTA image, the user marks the centre of the macular region. It helps to divide the image into 11 sub-regions for analysis. The software delivers microvascular metrics such as vessel area density and foveal avascular zone area. The details can be found <a href="https://karger.com/oph/article/243/1/75/263894/OCT-Angiography-Measurement-of-Retinal-Macular">here</a>.`,
    imgSrc: 'https://karger.silverchair-cdn.com/karger/content_public/journal/oph/issue/243/1/2/m_oph_243_n_1_cover.png?Expires=1735261355&Signature=2~JOkfgskS2St1zOnt8YHhxgZAbXDqaa8YK8rNgk-aX0S50~C~rMhHQpEl4hfsp3a3wUqX4P3jivee9tsvLfCh-Gx4iGs~dr776TmBySqkRg63ZPhHRB3iDEVOQBTJzG0Q1SdpzEKsfUHuFtYNb7CB2V3GC9nHM194BYQ27kBUaHXNPYU5CYOyzIESS9pGaMfrhjLcGxC69wT~MHQAwiB2-x4L3eO6QDmvxSSCnXsgrq~C1zM~7fKPZRoR42OGt0mDN4Xs8pTtTc-6I2E8PiUT23Lf2piEerLf7VMk1n1vzOXhgizS3xetTdHA5aBlIwnaWhdWDyQ3RWoe~qqJgRuw__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA',
    href: '',
  },
  {
    title: 'OCTAVA',
    description: `N/A`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '',
  },
  {
    title: 'OCTA-ReVA',
    description: `A semi-automated tool coded in Matlab and designed as stand-alone software with a graphical user interface. It supports single and batch processing. Enables saving of analysis results directly into Excel format and exporting of the images. The software applies the Frangi vesselness filter and five different segmentation methods (Otsu thresholding algorithm, fixed thresholding, mean thresholding, median thresholding, and the 3-sigma method). The software delivers several metrics, including blood vessel density (BVD), blood vessel tortuosity (BVT), blood vessel calibre (BVC), perfusion intensity density, vessel area flux and normalised blood flow index, fovea avascular zone area (FAZA), FAZ perimeter, FAZ irregularity. `,
    imgSrc: '/static/images/time-machine.jpg',
    href: 'https://github.com/fiifijackson/OCTA-ReVA?tab=readme-ov-file',
  },
]

const resourceData2: Resource[] = [
]

const resourceListData: ResourceList[] = [
  {
    title: 'OPTICAL COHERENCE TOMOGRAPHY ANGIOGRAPHY',
    data: resourceData1
  },
  {
    title: 'ANTERIOR CHAMBER',
    data: resourceData2
  },
]

const resourcePost: ResourcePost = {
  title: "OPEN-SOURCE SOFTWARE TOOLS",
  data: resourceListData
}

export default resourcePost
