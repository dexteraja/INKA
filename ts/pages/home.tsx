import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { useJobs } from '@/hooks/useJobs';
import { 
  Train, 
  ChevronRight, 
  Search, 
  Clock, 
  Award, 
  Users, 
  Briefcase, 
  MapPin, 
  CalendarClock,
  Shield,
  TreePine,
  School
} from 'lucide-react';

export default function Home() {
  // Fetch featured jobs (limit to 3)
  const { data: jobs, isLoading } = useJobs();
  const featuredJobs = jobs?.slice(0, 3);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/80 to-background pointer-events-none" />
        <div className="absolute right-0 top-1/3 -translate-y-1/2 w-1/2 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 transform rotate-45" />
        <div className="absolute left-1/4 bottom-1/4 w-1/3 h-64 bg-primary/30 rounded-full blur-3xl opacity-30" />
        
        <div className="container relative px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Rekrutmen Sekarang Dibuka
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                Mulai Karir <span className="text-primary">Perkeretaapian</span> Anda Bersama Kami
              </h1>
              
              <p className="text-xl text-foreground/80 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                Kami menawarkan peluang karir yang menantang dan bermanfaat di industri perkeretaapian. Bergabunglah dengan tim kami dan jadilah bagian dari revolusi transportasi masa depan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
                <Link href="/jobs">
                  <Button size="lg" className="gap-2 shadow-lg">
                    <Search className="h-5 w-5" />
                    Lihat Lowongan
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="accent" className="gap-2">
                    <Users className="h-5 w-5" />
                    Posisi Unggulan
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-700">
                <div className="text-center">
                  <div className="flex justify-center">
                    <Users className="h-6 w-6 text-primary mb-2" />
                  </div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs text-foreground/70">Karyawan</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <MapPin className="h-6 w-6 text-primary mb-2" />
                  </div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-xs text-foreground/70">Lokasi</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <Briefcase className="h-6 w-6 text-primary mb-2" />
                  </div>
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-xs text-foreground/70">Posisi Tersedia</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <CalendarClock className="h-6 w-6 text-primary mb-2" />
                  </div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-xs text-foreground/70">Tahun Pengalaman</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative animate-in fade-in slide-in-from-right-10 duration-1000">
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-primary/90 to-orange-400/90 p-1 rounded-lg shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
                    alt="Railway Professionals" 
                    className="rounded-md w-full h-auto object-cover aspect-video"
                  />
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -right-6 -bottom-6 bg-accent p-4 rounded-lg shadow-lg transform rotate-6">
                  <Train className="h-10 w-10 text-black" />
                </div>
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTI0IDZoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptMTIgMGg2djZoLTZ2LTZ6bTEyIDBoNnY2aC02di02ek0yNCA0OGg2djZoLTZ2LTZ6bTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTI0IDZoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
        
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Mengapa Bergabung dengan <span className="text-primary">INKA</span>?
            </h2>
            <p className="text-lg text-foreground/80">
              Kami menawarkan lingkungan kerja yang dinamis dan bermanfaat dengan budaya yang mendukung pertumbuhan dan kolaborasi.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover glass className="p-8 border-0">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manfaat Terbaik di Industri</h3>
              <p className="text-foreground/70">
                Manfaat kesehatan komprehensif, rencana pensiun, dan cuti berbayar yang cukup untuk mendukung kesejahteraan Anda.
              </p>
            </Card>
            
            <Card hover glass className="p-8 border-0">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Keseimbangan Kerja-Hidup</h3>
              <p className="text-foreground/70">
                Jadwal fleksibel, opsi kerja jarak jauh, dan kebijakan ramah keluarga untuk membantu Anda berkembang.
              </p>
            </Card>
            
            <Card hover glass className="p-8 border-0">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Train className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Teknologi Canggih</h3>
              <p className="text-foreground/70">
                Bekerja dengan sistem perkeretaapian canggih dan teknologi inovatif yang membentuk masa depan transportasi.
              </p>
            </Card>
            
            <Card hover glass className="p-8 border-0">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <School className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pengembangan Karir</h3>
              <p className="text-foreground/70">
                Program pelatihan berkelanjutan, pendidikan lanjutan dan jalur karir yang jelas untuk pertumbuhan profesional Anda.
              </p>
            </Card>
            
            <Card hover glass className="p-8 border-0">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Keamanan dan Stabilitas</h3>
              <p className="text-foreground/70">
                Pekerjaan jangka panjang dengan organisasi yang stabil, menawarkan keamanan dalam industri penting.
              </p>
            </Card>
            
            <Card hover glass className="p-8 border-0">
              <div className="rounded-xl bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <TreePine className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inisiatif Berkelanjutan</h3>
              <p className="text-foreground/70">
                Berkontribusi pada transportasi hijau melalui inisiatif ramah lingkungan dan proyek berkelanjutan.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 dark:bg-[radial-gradient(#444_1px,transparent_1px)]" />
        
        <div className="container px-4 mx-auto relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Lowongan Terbaru</h2>
              <p className="text-foreground/70 max-w-2xl">
                Jelajahi kesempatan karir menarik di berbagai departemen dan lokasi di seluruh jaringan kami.
              </p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2">
                Lihat Semua Lowongan
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 shadow-lg overflow-hidden animate-pulse">
                    <div className="h-3 bg-muted/60 rounded-full w-1/3 mx-6 mt-6 mb-3"></div>
                    <div className="h-6 bg-muted/60 rounded-full w-3/4 mx-6 mb-4"></div>
                    <div className="h-4 bg-muted/60 rounded-full mx-6 mb-2"></div>
                    <div className="h-4 bg-muted/60 rounded-full w-5/6 mx-6 mb-5"></div>
                    <div className="flex mx-6 gap-4 mb-6">
                      <div className="h-4 bg-muted/60 rounded-full w-1/3"></div>
                      <div className="h-4 bg-muted/60 rounded-full w-1/3"></div>
                    </div>
                    <div className="h-12 bg-muted/30"></div>
                  </Card>
                ))}
              </>
            ) : featuredJobs && featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card hover className="border-0 shadow-lg overflow-hidden transition-all duration-300 h-full flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4 uppercase tracking-wide">
                        {job.department.replace('_', ' ')}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{job.title}</h3>
                      <p className="text-foreground/70 mb-4 line-clamp-2">{job.shortDescription}</p>
                      <div className="flex items-center text-sm text-foreground/60 gap-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-primary/70" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 text-primary/70" />
                          <span>{job.jobType.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <Button variant="ghost" className="w-full justify-between group">
                        <span className="group-hover:text-primary transition-colors">Lihat Detail</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Train className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                <p className="text-lg font-medium">Lowongan tidak tersedia untuk saat ini.</p>
                <p className="text-foreground/70 mt-2">Silakan periksa kembali dalam waktu dekat!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 mix-blend-overlay opacity-25">
          <svg viewBox="0 0 2000 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,1000 L2000,1000 L2000,0 L0,0 L0,1000 Z" fill="none" stroke="white" strokeWidth="8" strokeDasharray="20 15" strokeLinecap="round"></path>
            <path d="M0,350 L2000,350" fill="none" stroke="white" strokeWidth="6" strokeDasharray="30 20" strokeLinecap="round"></path>
            <path d="M0,700 L2000,700" fill="none" stroke="white" strokeWidth="6" strokeDasharray="30 20" strokeLinecap="round"></path>
          </svg>
        </div>
        
        <div className="container px-4 mx-auto text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Bergabung dengan Masa Depan Perkeretaapian?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Ambil langkah berikutnya dalam perjalanan karir Anda dan temukan peluang yang menanti Anda di Industri Kereta Api.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button size="lg" variant="accent" className="gap-2 text-black">
                  <Search className="h-5 w-5" />
                  Jelajahi Lowongan
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2 bg-white/20 backdrop-blur-sm border-white hover:bg-white hover:text-primary">
                  <Users className="h-5 w-5" />
                  Buat Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Apa Kata <span className="text-primary">Karyawan Kami</span>
            </h2>
            <p className="text-lg text-foreground/80">
              Dengarkan pengalaman langsung dari tim kami dan ketahui mengapa mereka memilih berkarir di PT Industri Kereta Api.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-background to-accent/10 border border-accent/20 rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  SA
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Surya Aditya</h3>
                  <p className="text-sm text-muted-foreground">Masinis Senior, 8 tahun</p>
                </div>
              </div>
              <p className="italic text-foreground/70 mb-4">
                "Bekerja di INKA memberikan saya kesempatan untuk mengoperasikan teknologi perkeretaapian terbaru sambil menikmati stabilitas pekerjaan dan keseimbangan kehidupan kerja yang luar biasa."
              </p>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-background to-accent/10 border border-accent/20 rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  DP
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dewi Pratiwi</h3>
                  <p className="text-sm text-muted-foreground">Insinyur Pemeliharaan, 5 tahun</p>
                </div>
              </div>
              <p className="italic text-foreground/70 mb-4">
                "Program pengembangan karir di Industri Kereta Api telah membantu saya berkembang dari teknisi junior hingga posisi kepemimpinan. Saya sangat menghargai fokus perusahaan pada kemajuan pendidikan dan pertumbuhan karyawan."
              </p>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-background to-accent/10 border border-accent/20 rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  BW
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Budi Winarno</h3>
                  <p className="text-sm text-muted-foreground">Manajer Stasiun, 12 tahun</p>
                </div>
              </div>
              <p className="italic text-foreground/70 mb-4">
                "Sebagai manajer, saya menghargai budaya inovatif INKA yang mendorong ide-ide baru dan kolaborasi. Sistem dukungan dan keseimbangan kehidupan kerja yang mereka tawarkan tidak tertandingi di industri ini."
              </p>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5" fill={i <= 4 ? "currentColor" : "none"} stroke={i > 4 ? "currentColor" : "none"} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              INKA <span className="text-primary">dalam Angka</span>
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Sejak didirikan, kami telah tumbuh menjadi pemimpin industri perkeretaapian dengan rekor yang terbukti dalam keamanan, inovasi, dan layanan pelanggan.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-accent/10 rounded-xl border border-accent/20 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm font-medium text-muted-foreground">Karyawan Profesional</div>
            </div>
            
            <div className="text-center p-6 bg-accent/10 rounded-xl border border-accent/20 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm font-medium text-muted-foreground">Tahun Pengalaman</div>
            </div>
            
            <div className="text-center p-6 bg-accent/10 rounded-xl border border-accent/20 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm font-medium text-muted-foreground">Tingkat Kepuasan</div>
            </div>
            
            <div className="text-center p-6 bg-accent/10 rounded-xl border border-accent/20 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm font-medium text-muted-foreground">Lokasi di Indonesia</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pertanyaan yang <span className="text-primary">Sering Diajukan</span>
            </h2>
            <p className="text-lg text-foreground/80">
              Temukan jawaban untuk pertanyaan umum tentang karir di PT INKA dan proses rekrutmen kami.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Bagaimana cara melamar di INKA?</h3>
              <p className="text-foreground/70">
                Daftar akun di situs kami, jelajahi lowongan kerja, dan kirimkan lamaran online. Anda juga dapat menyimpan profil untuk peluang di masa mendatang.
              </p>
            </div>
            
            <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Berapa lama proses aplikasi?</h3>
              <p className="text-foreground/70">
                Proses biasanya membutuhkan waktu 2-4 minggu tergantung pada posisi, termasuk screening, wawancara, dan penilaian.
              </p>
            </div>
            
            <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Apakah Industri Kereta Api menawarkan program magang?</h3>
              <p className="text-foreground/70">
                Ya, kami menawarkan magang untuk mahasiswa dan lulusan baru. Program kami dirancang untuk memberikan pengalaman dunia nyata.
              </p>
            </div>
            
            <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Kualifikasi apa yang dicari PT INKA?</h3>
              <p className="text-foreground/70">
                Kami mencari individu dengan keterampilan teknis yang relevan, kemampuan memecahkan masalah, semangat tim, dan dedikasi terhadap keselamatan dan pelayanan.
              </p>
            </div>
            
            <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Di mana lokasi kantor INKA?</h3>
              <p className="text-foreground/70">
                Kami memiliki kantor pusat di Jakarta dan operasi di lebih dari 50 lokasi di seluruh Indonesia. Beberapa posisi menawarkan pengaturan kerja jarak jauh.
              </p>
            </div>
            
            <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Apa rencana pengembangan karir di Industri Kereta Api?</h3>
              <p className="text-foreground/70">
                Kami menawarkan jalur karir yang jelas dengan pelatihan berkelanjutan, program pengembangan kepemimpinan, dan kesempatan untuk mobilitas internal di berbagai departemen.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-background to-accent/5 border border-accent/20 rounded-xl p-8 md:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Dapatkan Informasi Lowongan Terbaru
              </h2>
              <p className="text-foreground/70">
                Berlangganan newsletter kami untuk mendapatkan update tentang posisi baru, acara rekrutmen, dan tips perjalanan karir di VirtualRail.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Alamat email Anda" 
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button className="h-12">
                Berlangganan
              </Button>
            </div>
            
            <div className="text-center mt-4 text-xs text-muted-foreground">
              Dengan berlangganan, Anda menyetujui Kebijakan Privasi kami. Anda dapat berhenti berlangganan kapan saja.
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}