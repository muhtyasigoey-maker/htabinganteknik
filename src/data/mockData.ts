import { Product, Customer, Transaction, Warehouse, StockActivity } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'TRX-SDS-1019',
    name: 'Baut Baja Ringan SDS 10×19 (Pcs)',
    category: 'Bangunan',
    price: 450,
    stock: 2500,
    unit: 'Pcs',
    minStock: 200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKFHhdSrKY4zv6ZAfpNEuHmmTC5zmrqySjZyAkGu9BAP_W3UeXTp84p72Pg4vp_z1rS65SqYjLicKWbNPv5uUyqozu_PtjC1B_MpoZulezD6vRPxC9yVOOnEGTy--K7_Vrgkk0XI2oA6I2xswKIvY3Z_iFmOBacmY38lQ2o6Qy4TEjD5piu7OsHg7GM3GV1oeObddDadfIp0tjCX9dqeVMrPazL9tscTAma8ZFLCeHaSREKzAmCgx7ayBG63xLyvWpUTmIfwnVkiI'
  },
  {
    id: 'p2',
    sku: 'TRX-PALU-16',
    name: 'Palu Kambing 16oz Tekiro',
    category: 'Perkakas',
    price: 85000,
    stock: 18,
    unit: 'Unit',
    minStock: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI-ud-v7iPaX0tZczuqquv25xu2IoP8Id-gn1Z3CVzvtv92PpbG8tVgwAY75WzwOfIpMPH00xz6AqimdQKQqUXbjKhx8Oip1AmEZBUjmBnnNouYwT5vq6PNFzYCB0V51W55b7WhD2asSobMVT_30igX0JPQrENQxnbXMzO5jEdvDPHYdlS119hb0l3arCoqHFX6bWS6pRkPR9f9jaxtAzXOoOb6i78E_R6xAOfoN0W0LfzwicamGFC1De2cQJdOOpvzoFy79CGHQQ'
  },
  {
    id: 'p3',
    sku: 'TRX-CAT-25G',
    name: 'Cat Propan Decorflex 2.5kg (Grey)',
    category: 'Cat & Aksesoris',
    price: 215000,
    stock: 14,
    unit: 'Pail',
    minStock: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAABg_g-c0QVGHnGza4WZ5owY7M0ACCbN5UyCEa4pIIUlyWNX55UnX0TCYBRDslUJyc0frikT29v9Q3Y2MQyzyecEUhMFxFN6K5xFKNcvfD6PMrZ5R6c055kJaVu3b15R-zd8ILevyU_8co6wTi1gNMTcwbmiRYlR2vrk_2-OM_y9kzf5hoHUnqtMieqBIFciLnTbAUtlxAHWKzKEtUs3P7Mt0s3SphEJhMpXy8QMquUlpZSndP-IyNd8HSRYnZDq7CPqyGT3oerFk'
  },
  {
    id: 'p4',
    sku: 'DR-9021',
    name: 'Mata Bor Beton Bosch SDS Plus-1 10×110/160mm',
    category: 'Perkakas',
    price: 45000,
    stock: 24,
    unit: 'Unit',
    minStock: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADVXitW7rnRxleUb55RyvgSVxJen1wyRQsJ-ENrpTKGSgbau0_gSxc38lhZOtzodWNgr0uPXgGz4U-nkICpKWLs1PxOBcE9GG5PN3-93r-kmRRy35K-BUjMyA2jW094WBIYxEQea96qocqGzg3_OXdfpgPuSDCvzy5eE78BlzENKFo1AZkck2OU_mAlrKEO2LnhxMeWMFwtb5nlEX0U3mmijFNLzvfKjfCFanJ6PqPzwyxDiN2Ad6t1qIOemcPv9JZjh59dQMmT_w'
  },
  {
    id: 'p5',
    sku: 'MTR-STN-5M',
    name: 'Meteran Stanley Tylon 5 Meter / 16 Feet',
    category: 'Perkakas',
    price: 85000,
    stock: 12,
    unit: 'Unit',
    minStock: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI-ud-v7iPaX0tZczuqquv25xu2IoP8Id-gn1Z3CVzvtv92PpbG8tVgwAY75WzwOfIpMPH00xz6AqimdQKQqUXbjKhx8Oip1AmEZBUjmBnnNouYwT5vq6PNFzYCB0V51W55b7WhD2asSobMVT_30igX0JPQrENQxnbXMzO5jEdvDPHYdlS119hb0l3arCoqHFX6bWS6pRkPR9f9jaxtAzXOoOb6i78E_R6xAOfoN0W0LfzwicamGFC1De2cQJdOOpvzoFy79CGHQQ'
  },
  {
    id: 'p6',
    sku: 'LEM-ABN-65',
    name: 'Lem Aibon Serbaguna 65gr',
    category: 'Cat & Aksesoris',
    price: 12500,
    stock: 120,
    unit: 'Unit',
    minStock: 20,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzFZ9W36lBQbVLUlwH5nlJa2ykwKiafRfp09CaFLCU8Riywg6w4MW-rBriZVSQDbfT7MzhyzLxqHNW1YVmVICN9eASnL9Di2rxrLE2Elb_XLyXIL_sHveIW8LcBjGAceDs0wV7b_qvdIQ4QXKyQBibNZakf10CRjcDUN0PsttQTKbMhkUcymphJ8z9L-XWb6sGsq6BnB-q4QyI5n-UeIPnu0tHmlSz-ZNFIPx9c7BL4sHyBafrr_hIx1jpnRqHG2iuDRhmM2ZrsZA'
  },
  {
    id: 'p7',
    sku: 'GRG-PST-18',
    name: 'Gergaji Kayu Pro-Steel 18"',
    category: 'Bangunan',
    price: 85000,
    stock: 24,
    unit: 'Unit',
    minStock: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX4rx8JYy5MkNJv7DPr7gLI91cwTvWXiwH3r6mUnGJbF1yQ5toRLw33wY1QqhlPPPqap1tWYul2to155z5aCSOP2Rsncx3kCxGcQA1gpJE6hlL7akO02QPYhBrQOrv7Xjaqh5ctWm5fLNle6zLjIf3VDW8Uay-gMONVGacUQgYQgWzKHriJI41KPS144LkHV0A4Jj1ydZJzr-njOem_4OnU-vbcwSIDndfHfzAGg7y-CUMwaGOwvIXZUC6JUXLqJGuA2IwVuSvjFw'
  },
  {
    id: 'p8',
    sku: 'STP-KNG-34',
    name: 'Stop Kran Kuningan 3/4"',
    category: 'Plumbing',
    price: 42000,
    stock: 156,
    unit: 'Unit',
    minStock: 30,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChpq4bGudqVazuQ0Hf_ToSGyQU3PrFG_dAbjDiJhEbxGFy9JT42S-vEUUwtHWdQpHiTqB5vp3JmlGe3GQIYkZwyOI4LgUK6uFYVpFGhUOzzEwt-gILFSZ9QT0t2e7K14jD_LUxqLDhtud2oHlEESXlvQ-FQtsu8ot3ye0Kk2XUPJafHkvlbPTILZyj4A0QwCbFcTR-t47BIhW-Tk00wmLC_w-zpQHccEBl8FBw_P3J21JhSDn-Ww0U3EvOyh-n97ulQ55_KQZfA-I'
  },
  {
    id: 'p9',
    sku: 'KBL-NYM-215',
    name: 'Kabel NYM 2×1.5mm (50m)',
    category: 'Listrik',
    price: 320000,
    stock: 12,
    unit: 'Roll',
    minStock: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4J8PhbxuGXJC78wUYWXWvS0n7mAcqNZ_-3eqclY66uyoB-3nFWk6T4EANZxPf7hYdkiVGxJzjboZE9lULwBwYNlMW3UeB4f5E19R5_gCDrUYDMYU8orR9N33xip7m7uJdw3Lc_dtv36Jo7NJLHj_LS85NW6XuEEUAbVAs7fHzzpwcqiiBvhj_7wwpwYryxjmvPM8aW6B9RXfkf2u_NODJ489RvGFujG0C-aRpYoYNo8PI23bfgXM8broETmcS700_dXMJLLCGcdA'
  },
  {
    id: 'p10',
    sku: 'CAT-TBK-5K',
    name: 'Cat Tembok Putih 5kg',
    category: 'Cat & Aksesoris',
    price: 145000,
    stock: 5,
    unit: 'Galon',
    minStock: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAABg_g-c0QVGHnGza4WZ5owY7M0ACCbN5UyCEa4pIIUlyWNX55UnX0TCYBRDslUJyc0frikT29v9Q3Y2MQyzyecEUhMFxFN6K5xFKNcvfD6PMrZ5R6c055kJaVu3b15R-zd8ILevyU_8co6wTi1gNMTcwbmiRYlR2vrk_2-OM_y9kzf5hoHUnqtMieqBIFciLnTbAUtlxAHWKzKEtUs3P7Mt0s3SphEJhMpXy8QMquUlpZSndP-IyNd8HSRYnZDq7CPqyGT3oerFk'
  },
  {
    id: 'p11',
    sku: 'BOR-CRD-18',
    name: 'Bor Baterai Cordless 18V',
    category: 'Perkakas',
    price: 1200000,
    stock: 8,
    unit: 'Unit',
    minStock: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ89B4l0HvPVNCse7zHJ07qfaUTxOENdLvzqO_jxyBsvUQZ5M2-Ml-iIZvxg-IwYCqCK9cZJxHdr9hHsOylOC8lWF_ItOEZOgoSBZ3C_xPmo4MYQ3TVIKa1VXEuOtNLZdPNdmFMS7pgZABchtTJJuPgH4P_IsuJ8AX1fldS9-VE2o1tIAcQF4kvnzh5K46OiKS-zmO8oFQlCqEanA3WkmXafgKbIJkxuIJeRmGLUpher7cTOAMPl9ZlV2tpuUzlNeFAdMNyNhRIt8'
  },
  {
    id: 'p12',
    sku: 'SKR-GPS-20',
    name: 'Sekrup Gypsum 2" (100pcs)',
    category: 'Bangunan',
    price: 25000,
    stock: 42,
    unit: 'Box',
    minStock: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKFHhdSrKY4zv6ZAfpNEuHmmTC5zmrqySjZyAkGu9BAP_W3UeXTp84p72Pg4vp_z1rS65SqYjLicKWbNPv5uUyqozu_PtjC1B_MpoZulezD6vRPxC9yVOOnEGTy--K7_Vrgkk0XI2oA6I2xswKIvY3Z_iFmOBacmY38lQ2o6Qy4TEjD5piu7OsHg7GM3GV1oeObddDadfIp0tjCX9dqeVMrPazL9tscTAma8ZFLCeHaSREKzAmCgx7ayBG63xLyvWpUTmIfwnVkiI'
  },
  {
    id: 'p13',
    sku: 'WR-SET-12',
    name: 'Kunci Pas Set 12 Pcs Chrome Vanadium',
    category: 'Perkakas',
    price: 425000,
    stock: 2,
    unit: 'Set',
    minStock: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcD8v2l8bk4Gcf7FsXar0pPn78U3Qd_95ZiFEMoCQmcNvLdaJvJmXgWQGwXJoYJ9TPUMOLB_5YksTwSsLVroTcWAw57yKjZHnqH44XEQdSLfllKuNAIOfIWH27aR2aeiFlRfQADSs_IabEa_AHHwhdbPO__e3sfGJddTB2kjnhCSv0MZbdyt3GneKP_8tGnOwmeFveXzzd2DYXV7cSQtQ6AhXby-Hg3fZzbQodnId9bDoo8dwJW-p_z0XjQOFEKTyqSX_IANj7oGo'
  },
  {
    id: 'p14',
    sku: 'SF-HELM-Y',
    name: 'Helm Proyek Safety Ultra V3 Yellow',
    category: 'Bangunan',
    price: 120000,
    stock: 45,
    unit: 'Unit',
    minStock: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTdiFkWJbMoNA4OuB1GZS4KU6tigz0zSr-dAfauNz4SDYOMtjub1JZSV-t0oP3z1E24UCNwKTm6RLksisqzD9ZatO4zwvJK81CZ1c1OF9VWN2gv0IFcV2X5AcNkJwjW9IisJnqkhe3wM7l1Un6asCO2yAWmz21dmAP0Ij7YSIzPPy-mHUPusM8eOtRaxfU3fkyii1Ch8bn11t4NLdlMxAtkHSF-aVwOLpdB3lzTaDFd_CgszuB63ZQT1iws1etnwIUnNvRe_NYkE'
  },
  {
    id: 'p15',
    sku: 'EL-MET-X2',
    name: 'Digital Multimeter High Precision X200',
    category: 'Listrik',
    price: 1150000,
    stock: 8,
    unit: 'Unit',
    minStock: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7NUu-IGZej2NyB4uK-mTEsuLlH1XuCTjb0-CEyiDm01dOouLl3xOI35wFvzYA_ue8f2ESjS3vTG2W-lgxDea2vjVWwqejRCN_T5nlZM7vaymgZqfd64UqQMiO0wzKlDYlx8wINfRrHGj2ikMhIlMCfVBdiZNGnjPdPpKOSL66ZF-5uLXYnM5jqtoYj4XoTPUZ1wxLnh0oGcmxa7ThaVsPOkAC0SjJtQsoBrGYzDmuVqLBa5MXFffr55I5lQdH2P9Fvmn9DbTU34'
  },
  {
    id: 'p16',
    sku: 'LB-WD40-4',
    name: 'Pelumas Anti Karat 400ml Multi-Purpose',
    category: 'Perkakas',
    price: 65000,
    stock: 120,
    unit: 'Kaleng',
    minStock: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqu_nyys6zaBhsGiMbzZ78R3Q3JmyUgIJNDFpJ104CWoE5OU-ecAfmIGJ66Tcs76dMllKla4OS4_YhbF09fgmpPQvAR1_Cy3NDkzwyKepv6vE35QxJR8Q82FITGd4h6Ph0hVFYKEJaZ0AA041zTRDKEaw4b-SdaRUfE8u_Lq8oFjwagTdF5FHxnd6K4W_gR114AvATQcBwsib-pqwxgx1wZb5zi1W_yTyBhXT4qzFN84r39KWhVbOPxlpzbHl9Qq8cR66TrsQSIdQ'
  },
  {
    id: 'p17',
    sku: 'SAW-BLD-7',
    name: 'Mata Gergaji Circular 7 Inch Carbide',
    category: 'Perkakas',
    price: 215000,
    stock: 0,
    unit: 'Pcs',
    minStock: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2JsWB3wNeNAE0pIuiVyOKDuSGupMQ3i4fNRXUHibjKj8JgvGpHsD3QIOIlYUnxf9VmhB61lLokg-EIBRsPSF8tHAQhtVMjubzIqlEnMt0Ek0aPBuzxfNXa2tHWvGKkbDyYvXPg9OPATzoHqR53DcxM9S-RpiMgGPq6H0U785lU2njQ7C8CkUCT9Ve0BxuVIYE5EIv3JL9ZQB-7dToZteijnph_qb5dgGqOX4moVHxYntwGppmJ34XIWKCXgVVEIyTH_qbUm48DY8'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Umum (Default)', type: 'Pelanggan Langsung' },
  { id: 'c2', name: 'Budi Santoso', type: 'Kontraktor Perorangan', phone: '0812-3456-7890' },
  { id: 'c3', name: 'UD Bangunan Jaya', type: 'Mitra Toko / Grosir', phone: '0821-9876-5432' },
  { id: 'c4', name: 'PT Konstruksi Utama', type: 'Perusahaan B2B', phone: '021-555-9988' },
  { id: 'c5', name: 'Pak Hendra Mandiri', type: 'Tukang Langganan', phone: '0857-1122-3344' }
];

export const DEFAULT_CUSTOMER: Customer = INITIAL_CUSTOMERS[0];




export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '#TRX-20231024-001',
    date: '24 Okt 2023',
    time: '14:35 WIB',
    cashier: 'Admin Utama',
    customerName: 'Umum (Default)',
    items: [
      { id: 'p1', name: 'Baut Baja Ringan SDS 10×19 (Pcs)', quantity: 50, unitPrice: 450, totalPrice: 22500 },
      { id: 'p2', name: 'Palu Kambing 16oz Tekiro', quantity: 1, unitPrice: 85000, totalPrice: 85000 },
      { id: 'p3', name: 'Cat Propan Decorflex 2.5kg (Grey)', quantity: 2, unitPrice: 215000, totalPrice: 430000 }
    ],
    subtotal: 537500,
    tax: 59125,
    discount: 0,
    totalAmount: 596625,
    paymentMethod: 'cash',
    amountPaid: 600000,
    change: 3375,
    status: 'Selesai'
  },
  {
    id: '#TX-90214',
    date: '24 Mei 2024',
    time: '14:20 WIB',
    cashier: 'Kasir Budi',
    customerName: 'Budi Santoso',
    items: [
      { id: 'p11', name: 'Bor Baterai Cordless 18V', quantity: 1, unitPrice: 1200000, totalPrice: 1200000 },
      { id: 'p12', name: 'Sekrup Gypsum 2" (100pcs)', quantity: 2, unitPrice: 25000, totalPrice: 50000 }
    ],
    subtotal: 1250000,
    tax: 137500,
    discount: 0,
    totalAmount: 1387500,
    paymentMethod: 'cash',
    amountPaid: 1400000,
    change: 12500,
    status: 'Selesai'
  },
  {
    id: '#TX-90213',
    date: '24 Mei 2024',
    time: '13:55 WIB',
    cashier: 'Admin Utama',
    customerName: 'UD Bangunan Jaya',
    items: [
      { id: 'p9', name: 'Kabel NYM 2×1.5mm (50m)', quantity: 20, unitPrice: 320000, totalPrice: 6400000 },
      { id: 'p8', name: 'Stop Kran Kuningan 3/4"', quantity: 50, unitPrice: 42000, totalPrice: 2100000 }
    ],
    subtotal: 8500000,
    tax: 935000,
    discount: 100000,
    totalAmount: 9335000,
    paymentMethod: 'transfer',
    amountPaid: 9335000,
    change: 0,
    status: 'Selesai'
  },
  {
    id: '#TX-90212',
    date: '24 Mei 2024',
    time: '13:30 WIB',
    cashier: 'Kasir Budi',
    customerName: 'Walk-in Customer',
    items: [
      { id: 'p3', name: 'Cat Propan Decorflex 2.5kg (Grey)', quantity: 2, unitPrice: 215000, totalPrice: 430000 }
    ],
    subtotal: 430000,
    tax: 47300,
    discount: 0,
    totalAmount: 477300,
    paymentMethod: 'qris',
    amountPaid: 477300,
    change: 0,
    status: 'Dibatalkan'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'w1',
    name: 'Gudang Utama - Jakarta',
    location: 'Kawasan Industri Pulogadung, Jakarta Timur',
    totalStock: 45820,
    capacityPercentage: 78,
    status: 'ACTIVE'
  },
  {
    id: 'w2',
    name: 'Gudang Cabang - Bekasi',
    location: 'Kawasan Industri Jababeka, Cikarang',
    totalStock: 8210,
    capacityPercentage: 62,
    status: 'ACTIVE'
  },
  {
    id: 'w3',
    name: 'Gudang Cabang - Tangerang',
    location: 'Kawasan Pergudangan BSD, Tangerang',
    totalStock: 12450,
    capacityPercentage: 91,
    status: 'ACTIVE'
  }
];

export const INITIAL_STOCK_ACTIVITIES: StockActivity[] = [
  {
    id: 'a1',
    productName: 'Mata Bor Beton 10mm (Set)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCArqA-Ve3wLEXyAS2efBQF7y0rE4E156B-VsC7uX3VTZ588iNHhOym8euForeJmdXCqNMLTtgOy1588Ofkd-APMixdxJglYBc5VJRbYN7qPa0Js6q_KiuFULeAkmJ1uecGvDkBdsselLkZ4ln0cBHUppBI0IaJiC7uB-RmTiDd8TrCG7EHShm88c56FGYbUqGjgOs0nJjBs9oLtXcFCBrxZFrIeK7svVWMjteg4nmW9iJUA69-ZRnbTjTh9V6HhwqejZrVCaHWSsc',
    type: 'Audit',
    changeText: 'Update: Penyesuaian fisik (-2 unit)',
    time: '14:20',
    location: 'Jakarta'
  },
  {
    id: 'a2',
    productName: 'Kabel NYY 3×2.5mm',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm1WiH29BR5Mkkpn1Xj9pL3L5-hkIBLNP4IqLiGpEIq2N3LD9tD_ISMD9w2gOaXg3TaHnuFNKsecVJObZvwPVt7xR2ogZPyo1vd6dAMgI5CPjaIsvRCJTdMYaHpGtQRxStx2irl3jg335FRUCEQXNkt38R7CofhGcFnXpcSNCbc-9c46jRzoFUxpMUCR_Qwup5M4SYGD4Xtp6eZVPJY1GugqIkeNXs0DwuZP5HNzVA2oD5LMpMWKqPX_3oqaOSlfZ0QPPLcERI5GQ',
    type: 'Inbound',
    changeText: 'Update: Barang Masuk (+50m)',
    time: '12:05',
    location: 'Bekasi'
  },
  {
    id: 'a3',
    productName: 'Helm Proyek UltraGuard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTdiFkWJbMoNA4OuB1GZS4KU6tigz0zSr-dAfauNz4SDYOMtjub1JZSV-t0oP3z1E24UCNwKTm6RLksisqzD9ZatO4zwvJK81CZ1c1OF9VWN2gv0IFcV2X5AcNkJwjW9IisJnqkhe3wM7l1Un6asCO2yAWmz21dmAP0Ij7YSIzPPy-mHUPusM8eOtRaxfU3fkyii1Ch8bn11t4NLdlMxAtkHSF-aVwOLpdB3lzTaDFd_CgszuB63ZQT1iws1etnwIUnNvRe_NYkE',
    type: 'Sales',
    changeText: 'Update: Penjualan POS (-12 unit)',
    time: '10:45',
    location: 'Jakarta'
  }
];

export const WAREHOUSES = INITIAL_WAREHOUSES;
export const RECENT_ACTIVITIES = INITIAL_STOCK_ACTIVITIES;

