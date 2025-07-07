interface Research {
  title: string;
  authors?: string[];
  year?: string;
  abstract?: string;
  doi?: string;
  url?: string;
}

interface TRDizinResponse {
  data?: {
    publications?: Array<{
      title?: string;
      authors?: string[];
      publicationYear?: string;
      abstract?: string;
      doi?: string;
      url?: string;
    }>;
  };
  publications?: Array<{
    title?: string;
    authors?: string[];
    publicationYear?: string;
    abstract?: string;
    doi?: string;
    url?: string;
  }>;
}

// N8N webhook URL'i
const N8N_WEBHOOK_URL = 'https://pandaow3r.app.n8n.cloud/webhook/webhook-deneme';

// Mock data for fallback
const mockData: Research[] = [
  { 
    title: "Zekât Hesaplama Yöntemleri ve Modern Uygulamaları",
    authors: ["Dr. Ahmet Yılmaz", "Prof. Dr. Fatma Kaya"],
    year: "2023",
    abstract: "Bu çalışma modern zekât hesaplama yöntemlerini incelemektedir."
  },
  { 
    title: "İslami Finans Sisteminde Zekât'ın Rolü",
    authors: ["Prof. Dr. Mehmet Özkan"],
    year: "2022",
    abstract: "İslami finans sisteminde zekât'ın önemini ele alan kapsamlı bir araştırma."
  },
  { 
    title: "Çağdaş Zekât Sorunları ve Çözüm Önerileri",
    authors: ["Dr. Ayşe Demir", "Dr. Hasan Çelik"],
    year: "2023",
    abstract: "Modern dönemde karşılaşılan zekât sorunları ve çözüm önerileri."
  },
  { 
    title: "Zekât Mallarının Değerlendirilmesi",
    authors: ["Prof. Dr. Ali Şahin"],
    year: "2021",
    abstract: "Zekât mallarının tespiti ve değerlendirilmesi üzerine detaylı inceleme."
  },
  { 
    title: "İslami Ekonomide Zekât'ın Sosyal Adalete Katkısı",
    authors: ["Dr. Zeynep Arslan"],
    year: "2023",
    abstract: "Zekât'ın sosyal adalet açısından önemini inceleyen akademik çalışma."
  }
];


export async function fetchResearch(query: string): Promise<Research[]> {
  try {
    console.log('N8N webhook\'ine POST (query string ile) isteği gönderiliyor:', query);
    
    // 1. N8N webhook'ine POST isteği gönder (body olmadan, query string ile)
    const webhookUrlWithQuery = `${N8N_WEBHOOK_URL}?q=${encodeURIComponent(query)}`;
    const webhookResponse = await fetch(webhookUrlWithQuery, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!webhookResponse.ok) {
      console.warn(`N8N webhook hatası (${webhookResponse.status}), mock data kullanılıyor`);
      return getFilteredMockData(query);
    }

    const webhookData = await webhookResponse.json();
    console.log('N8N webhook yanıtı:', webhookData);

    // 2. N8N'den gelen yanıtı kontrol et ve işle
    const resultsArray = Array.isArray(webhookData)
      ? webhookData
      : Array.isArray(webhookData.data)
        ? webhookData.data
        : Array.isArray(webhookData.result)
          ? webhookData.result
          : Array.isArray(webhookData.publications)
            ? webhookData.publications
            : [];

    if (resultsArray.length > 0) {
      const processedData = resultsArray
        .filter((item: any) => item && (item.title || item.name))
        .map((item: any) => ({
          title: item.title || item.name || 'Başlıksız Araştırma',
          authors: item.authors || [],
          year: item.year || item.publicationYear || '',
          abstract: item.abstract || item.summary || '',
          doi: item.doi || '',
          url: item.url || ''
        }));
      if (processedData.length > 0) {
        console.log('N8N\'den başarılı veri alındı:', processedData.length, 'sonuç');
        return processedData;
      }
    }

    // 3. N8N'den veri gelmezse veya hatalıysa mock data kullan
    console.warn('N8N\'den geçerli veri gelmedi, mock data kullanılıyor');
    return getFilteredMockData(query);

  } catch (error) {
    console.error('N8N API hatası:', error);
    
    // Hata durumunda mock data döndür
    return getFilteredMockData(query);
  }
}

// Mock data'dan filtrelenmiş sonuçlar döndür
function getFilteredMockData(query: string): Research[] {
  const filteredData = mockData.filter((item: Research) => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    query.toLowerCase().split(' ').some(word => 
      word.length > 2 && item.title.toLowerCase().includes(word)
    )
  );

  return filteredData.length > 0 ? filteredData : mockData.slice(0, 5);
}

// API durumunu test etmek için yardımcı fonksiyon
export async function testApiConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          q: 'test'
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// TRDizin API'sine direkt erişim fonksiyonu (test amaçlı)
export async function fetchFromTRDizin(query: string): Promise<Research[]> {
  try {
    const trdizinUrl = `https://search.trdizin.gov.tr/api/defaultSearch/publication/?q=${encodeURIComponent(query)}&order=relevance-DESC&page=1&limit=5`;
    
    console.log('TRDizin API\'sine direkt istek:', trdizinUrl);
    
    const response = await fetch(trdizinUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Research-App/1.0)',
      }
    });

    if (!response.ok) {
      throw new Error(`TRDizin API hatası: ${response.status}`);
    }

    const data: TRDizinResponse = await response.json();
    console.log('TRDizin yanıtı:', data);

    // TRDizin yanıtını işle
    const publications = data.data?.publications || data.publications || [];
    
    return publications.map(pub => ({
      title: pub.title || 'Başlıksız Yayın',
      authors: pub.authors || [],
      year: pub.publicationYear || '',
      abstract: pub.abstract || '',
      doi: pub.doi || '',
      url: pub.url || ''
    }));

  } catch (error) {
    console.error('TRDizin API hatası:', error);
    throw error;
  }
}