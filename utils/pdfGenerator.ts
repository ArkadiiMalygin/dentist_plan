
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface Task {
    toothNumber: number;
    description: string;
    cost: number;
}

interface Stage {
    title: string;
    tasks: Task[];
}

export const generatePdf = async (stages: Stage[]) => {
    const total = stages.reduce(
        (sum, stage) => sum + stage.tasks.reduce((s, t) => s + t.cost, 0),
        0
    );

    const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #333; }
          .stage { margin-bottom: 20px; }
          .task { margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>Treatment Plan</h1>
        ${stages.map((stage, i) => `
          <div class="stage">
            <h2>Stage ${i + 1}: ${stage.title}</h2>
            ${stage.tasks.map(task => `
              <div class="task">
                Tooth ${task.toothNumber}: ${task.description} - $${task.cost.toFixed(2)}
              </div>
            `).join('')}
          </div>
        `).join('')}
        <h2>Total Cost: $${total.toFixed(2)}</h2>
      </body>
    </html>
  `;

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
    } else {
        alert('PDF generated at: ' + uri);
    }
};
