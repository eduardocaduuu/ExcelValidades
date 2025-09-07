import { FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExportSectionProps {
  hasData: boolean;
}

export default function ExportSection({ hasData }: ExportSectionProps) {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!hasData) {
      toast({
        variant: "destructive",
        title: "Sem dados para exportar",
        description: "Faça upload de uma planilha primeiro"
      });
      return;
    }

    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      // Capture the entire dashboard container
      const element = document.body;
      
      if (element) {
        // Configure html2canvas for better quality and full capture
        const canvas = await html2canvas.default(element, {
          scale: 1.5, // Higher resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: window.innerWidth,
          height: document.documentElement.scrollHeight,
          scrollX: 0,
          scrollY: 0
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Calculate PDF dimensions (A4 format)
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        if (imgHeight <= pageHeight) {
          // Single page
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
          // Multiple pages
          let heightLeft = imgHeight;
          let position = 0;
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
        
        pdf.save('excel-validades-dashboard.pdf');
        
        toast({
          title: "PDF exportado com sucesso!",
          description: "O arquivo foi baixado para seu computador"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao exportar PDF",
        description: "Não foi possível gerar o arquivo PDF"
      });
    }
  };

  const handleExportImage = async () => {
    if (!hasData) {
      toast({
        variant: "destructive",
        title: "Sem dados para exportar",
        description: "Faça upload de uma planilha primeiro"
      });
      return;
    }

    try {
      const html2canvas = await import('html2canvas');
      
      // Capture the entire dashboard
      const element = document.body;
      
      if (element) {
        // Configure html2canvas for better quality and full capture
        const canvas = await html2canvas.default(element, {
          scale: 2, // High resolution for images
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: window.innerWidth,
          height: document.documentElement.scrollHeight,
          scrollX: 0,
          scrollY: 0
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'excel-validades-dashboard.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        toast({
          title: "Imagem exportada com sucesso!",
          description: "O arquivo foi baixado para seu computador"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao exportar imagem",
        description: "Não foi possível gerar a imagem"
      });
    }
  };


  return (
    <section className="bg-card p-8 neo-border neo-shadow-lg animate-slide-up" data-testid="export-section">
      <h3 className="text-2xl font-black mb-6 text-foreground">EXPORTAR DADOS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleExportPDF}
          disabled={!hasData}
          className="bg-destructive text-destructive-foreground p-6 font-black text-lg neo-border neo-shadow hover-lift neo-button disabled:opacity-50 flex flex-col items-center gap-2 h-auto"
          data-testid="button-export-pdf"
        >
          <FileText className="w-8 h-8" />
          EXPORTAR PDF
        </Button>
        
        <Button
          onClick={handleExportImage}
          disabled={!hasData}
          className="bg-accent text-accent-foreground p-6 font-black text-lg neo-border neo-shadow hover-lift neo-button disabled:opacity-50 flex flex-col items-center gap-2 h-auto"
          data-testid="button-export-image"
        >
          <Image className="w-8 h-8" />
          EXPORTAR IMAGEM
        </Button>
      </div>
    </section>
  );
}
