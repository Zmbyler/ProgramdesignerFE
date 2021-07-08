import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-pdf-generation',
  templateUrl: './pdf-generation.component.html',
  styleUrls: ['./pdf-generation.component.scss']
})
export class PdfGenerationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  generateAndSavePDF() {
    const element = document.getElementById('pdfData');
    const opt = {
      margin: 0.2,
      filename: 'Zachary ' + new Date(),
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' },
    };
    html2pdf().from(element).set(opt).toContainer().toCanvas().toImg().toPdf().save();
  }

}
