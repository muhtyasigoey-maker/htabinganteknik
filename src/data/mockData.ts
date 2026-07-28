import { Product, Customer, Transaction, Warehouse, StockActivity, StaffMember, Supplier, StoreBranch } from '../types';

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
  {
    id: 'c1',
    code: 'PLG-001',
    name: 'Umum (Default Walk-in)',
    type: 'Pelanggan Langsung',
    phone: '0800-111-222',
    email: 'walkin@customer.com',
    address: 'Toko Kasir Langsung',
    status: 'Aktif',
    totalTransactions: 154,
    totalSpent: 12500000,
    createdAt: '10 Jan 2023',
  },
  {
    id: 'c2',
    code: 'PLG-002',
    name: 'Budi Santoso (CV Karya Mandiri)',
    type: 'Kontraktor Perorangan',
    phone: '0812-3456-7890',
    email: 'budi.kontraktor@gmail.com',
    address: 'Jl. Merdeka No. 45, Jakarta Barat',
    status: 'Aktif',
    totalTransactions: 28,
    totalSpent: 45800000,
    createdAt: '15 Mar 2023',
  },
  {
    id: 'c3',
    code: 'PLG-003',
    name: 'UD Bangunan Jaya Utama',
    type: 'Mitra Toko / Grosir',
    phone: '0821-9876-5432',
    email: 'ud.bangunanjaya@yahoo.com',
    address: 'Ruko Pertokoan Maju Bersama No. 12, Bekasi',
    status: 'Aktif',
    totalTransactions: 42,
    totalSpent: 98200000,
    createdAt: '01 Feb 2023',
  },
  {
    id: 'c4',
    code: 'PLG-004',
    name: 'PT Konstruksi Utama Indonesia',
    type: 'Perusahaan B2B',
    phone: '021-555-9988',
    email: 'procurement@konstruksiutama.co.id',
    address: 'Gedung Menara Palma Lt. 15, Kuningan, Jakarta Selatan',
    status: 'Aktif',
    totalTransactions: 19,
    totalSpent: 185000000,
    createdAt: '20 Mei 2023',
  },
  {
    id: 'c5',
    code: 'PLG-005',
    name: 'Pak Hendra Mandiri',
    type: 'Tukang Langganan',
    phone: '0857-1122-3344',
    email: 'hendra.tukang@gmail.com',
    address: 'Jl. Kebon Jeruk No. 88, Jakarta Barat',
    status: 'Aktif',
    totalTransactions: 65,
    totalSpent: 18400000,
    createdAt: '12 Aug 2023',
  },
  {
    id: 'c6',
    code: 'PLG-006',
    name: 'Toko Bangunan Sumber Rejeki',
    type: 'Mitra Toko / Grosir',
    phone: '0813-8877-6655',
    email: 'sumberrejeki@tokomat.com',
    address: 'Jl. Raya Bogor Km 28, Depok',
    status: 'Aktif',
    totalTransactions: 31,
    totalSpent: 62400000,
    createdAt: '05 Sep 2023',
  },
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
    code: 'GDG-JKT-01',
    name: 'Gudang Utama - Jakarta',
    location: 'Pulogadung, Jakarta Timur',
    address: 'Kawasan Industri Pulogadung Blok B No. 18, Jakarta Timur',
    manager: 'Dede Saputra (Kepala Gudang)',
    phone: '021-4600-990',
    totalStock: 45820,
    capacityPercentage: 78,
    status: 'ACTIVE'
  },
  {
    id: 'w2',
    code: 'GDG-BKS-02',
    name: 'Gudang Cabang - Bekasi',
    location: 'Cikarang, Bekasi',
    address: 'Kawasan Industri Jababeka V Blok C-12, Cikarang, Bekasi',
    manager: 'Agus Setiawan',
    phone: '021-8988-123',
    totalStock: 8210,
    capacityPercentage: 62,
    status: 'ACTIVE'
  },
  {
    id: 'w3',
    code: 'GDG-TNG-03',
    name: 'Gudang Cabang - Tangerang',
    location: 'BSD, Tangerang Selatan',
    address: 'Kawasan Pergudangan BSD Multiguna Blok D No. 5, Tangerang',
    manager: 'Rudi Hartono',
    phone: '021-5370-888',
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

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st_1',
    name: 'Admin Utama',
    email: 'admin@tabingan.com',
    username: 'admin',
    password: 'admin123',
    phone: '0812-8899-7700',
    role: 'Admin POS',
    status: 'Aktif',
    shift: 'Full Time',
    avatar: 'AU',
    joinDate: '15 Jan 2022',
    totalTransactions: 1420,
    pin: '1234'
  },
  {
    id: 'st_2',
    name: 'Haji Tabingan',
    email: 'tabingan@teknik.co.id',
    username: 'kepalatoko',
    password: 'toko123',
    phone: '0811-9000-111',
    role: 'Kepala Toko',
    status: 'Aktif',
    shift: 'Full Time',
    avatar: 'HT',
    joinDate: '01 Jan 2020',
    totalTransactions: 890,
    pin: '8888'
  },
  {
    id: 'st_3',
    name: 'Budi Kurniawan',
    email: 'budi.kasir@tabingan.com',
    username: 'kasir',
    password: 'kasir123',
    phone: '0857-3344-5566',
    role: 'Kasir',
    status: 'Aktif',
    shift: 'Pagi (08:00 - 16:00)',
    avatar: 'BK',
    joinDate: '10 Feb 2023',
    totalTransactions: 654,
    pin: '2024'
  },
  {
    id: 'st_4',
    name: 'Siti Rahmawati',
    email: 'siti.kasir@tabingan.com',
    username: 'siti',
    password: 'kasir123',
    phone: '0813-2211-9988',
    role: 'Kasir',
    status: 'Aktif',
    shift: 'Sore (16:00 - 22:00)',
    avatar: 'SR',
    joinDate: '01 Jun 2023',
    totalTransactions: 412,
    pin: '1122'
  },
  {
    id: 'st_5',
    name: 'Dede Saputra',
    email: 'dede.gudang@tabingan.com',
    username: 'gudang',
    password: 'gudang123',
    phone: '0822-7766-5544',
    role: 'Staf Gudang',
    status: 'Aktif',
    shift: 'Pagi (08:00 - 16:00)',
    avatar: 'DS',
    joinDate: '12 Aug 2023',
    totalTransactions: 128,
    pin: '5566'
  },
  {
    id: 'st_6',
    name: 'Rian Pratama',
    email: 'rian.spv@tabingan.com',
    username: 'supervisor',
    password: 'spv123',
    phone: '0818-4455-6677',
    role: 'Supervisor',
    status: 'Cuti',
    shift: 'Full Time',
    avatar: 'RP',
    joinDate: '05 Mar 2021',
    totalTransactions: 310,
    pin: '9900'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_1',
    code: 'SUP-SEM-001',
    name: 'PT Semen Indonesia (Persero) Tbk',
    contactPerson: 'Bpk. Aris Setiawan',
    category: 'Semen & Material Bangunan',
    phone: '021-5261111',
    email: 'sales@semenindonesia.com',
    address: 'Gedung Utama Semen Indonesia, Lt. 8, Jl. Veteran, Jakarta Selatan',
    paymentTerms: 'Tempo 30 Hari',
    status: 'Aktif',
    totalOrders: 48,
    totalPurchases: 185000000,
    rating: 4.9
  },
  {
    id: 'sup_2',
    code: 'SUP-TKR-002',
    name: 'PT Altama Surya Anugerah (Tekiro Tools)',
    contactPerson: 'Ibu Hendra Wijaya',
    category: 'Perkakas Handtools',
    phone: '021-6902288',
    email: 'info@tekirortools.co.id',
    address: 'Kawasan Industri Bandara Soekarno Hatta, Tangerang',
    paymentTerms: 'Tempo 14 Hari',
    status: 'Aktif',
    totalOrders: 32,
    totalPurchases: 94500000,
    rating: 4.8
  },
  {
    id: 'sup_3',
    code: 'SUP-PRP-003',
    name: 'PT Propan Raya I.C.C. (Cat & Coating)',
    contactPerson: 'Bpk. Yudi Santoso',
    category: 'Cat & Aksesoris',
    phone: '021-59303333',
    email: 'order@propanraya.com',
    address: 'Jl. Raya Serang Km 12.5, Cikupa, Tangerang',
    paymentTerms: 'Tempo 30 Hari',
    status: 'Aktif',
    totalOrders: 26,
    totalPurchases: 68200000,
    rating: 4.7
  },
  {
    id: 'sup_4',
    code: 'SUP-WAV-004',
    name: 'PT Wavin Duta Jaya (Pipa & Fitting PVC)',
    contactPerson: 'Ibu Lina Kusuma',
    category: 'Pipa & Plumbing',
    phone: '021-8983000',
    email: 'distributor@wavin.co.id',
    address: 'Kawasan Industri MM2100, Cibitung, Bekasi',
    paymentTerms: 'Tempo 30 Hari',
    status: 'Aktif',
    totalOrders: 19,
    totalPurchases: 52000000,
    rating: 4.6
  },
  {
    id: 'sup_5',
    code: 'SUP-SCH-005',
    name: 'PT Schneider Electric Indonesia',
    contactPerson: 'Bpk. Michael Hartono',
    category: 'Kabel & Peralatan Listrik',
    phone: '021-2988888',
    email: 'cs.id@se.com',
    address: 'Cilandak Commercial Estate Building 401, Jakarta Selatan',
    paymentTerms: 'Cash On Delivery',
    status: 'Aktif',
    totalOrders: 14,
    totalPurchases: 41000000,
    rating: 4.9
  },
  {
    id: 'sup_6',
    code: 'SUP-BOS-006',
    name: 'PT Robert Bosch Indonesia (Power Tools)',
    contactPerson: 'Bpk. David Kurnia',
    category: 'Power Tools & Aksesoris',
    phone: '021-3005500',
    email: 'powertools.id@bosch.com',
    address: 'Menara BTPN Lt. 31, Mega Kuningan, Jakarta Selatan',
    paymentTerms: 'Tempo 60 Hari',
    status: 'Aktif',
    totalOrders: 22,
    totalPurchases: 87500000,
    rating: 4.8
  }
];

export const INITIAL_STORES: StoreBranch[] = [
  {
    id: 'store_1',
    code: 'CBG-JKT-01',
    name: 'Toko H. Tabingan Teknik (Pusat - Jakarta)',
    address: 'Jl. Raya Industri Pulogadung No. 88, Jakarta Timur',
    city: 'Jakarta Timur',
    phone: '021-4600-8888',
    manager: 'Haji Tabingan (Owner & Kepala Toko)',
    type: 'Pusat',
    status: 'Aktif',
    totalCashiers: 5,
    monthlyTarget: 500000000,
    monthlyRevenue: 485000000,
    openHours: '07:30 - 18:00 WIB'
  },
  {
    id: 'store_2',
    code: 'CBG-BKS-02',
    name: 'Toko H. Tabingan Teknik (Cabang Bekasi)',
    address: 'Jl. Raya Kartini No. 42, Bekasi Barat',
    city: 'Bekasi',
    phone: '021-8890-1234',
    manager: 'Dede Saputra',
    type: 'Cabang Utama',
    status: 'Aktif',
    totalCashiers: 3,
    monthlyTarget: 300000000,
    monthlyRevenue: 275000000,
    openHours: '08:00 - 17:30 WIB'
  },
  {
    id: 'store_3',
    code: 'CBG-TNG-03',
    name: 'Toko H. Tabingan Teknik (Cabang BSD Tangerang)',
    address: 'Ruko BSD Multiguna Blok A No. 15, Tangerang Selatan',
    city: 'Tangerang Selatan',
    phone: '021-5370-9999',
    manager: 'Rudi Hartono',
    type: 'Toko Retail',
    status: 'Aktif',
    totalCashiers: 2,
    monthlyTarget: 250000000,
    monthlyRevenue: 238000000,
    openHours: '08:00 - 18:00 WIB'
  },
  {
    id: 'store_4',
    code: 'CBG-DPK-04',
    name: 'Outlet Proyek H. Tabingan (Depok Margonda)',
    address: 'Jl. Margonda Raya No. 120, Depok',
    city: 'Depok',
    phone: '021-7720-5544',
    manager: 'Rian Prasetyo',
    type: 'Outlet Proyek',
    status: 'Aktif',
    totalCashiers: 2,
    monthlyTarget: 200000000,
    monthlyRevenue: 192000000,
    openHours: '08:00 - 17:00 WIB'
  }
];


