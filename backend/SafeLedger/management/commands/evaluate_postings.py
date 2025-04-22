from django.core.management.base import BaseCommand
from SafeLedger.models import Postings
from SafeLedger.ml.ml_model import evaluate_posting

class Command(BaseCommand):
    help = "Backfill the `is_suspicious` flag on all postings."

    def handle(self, *args, **options):
        qs = Postings.objects.all()
        to_update = []
        for p in qs:
            data = {
                "company_id": p.company_id,
                "accountHandleNumber": p.accountHandleNumber,
                "postAmount": float(p.postAmount),
            }
            try:
                p.is_suspicious = evaluate_posting(data)
                to_update.append(p)
            except Exception as e:
                self.stderr.write(f"Skipping {p.id}: {e}")

        # Bulk–update in a single query
        Postings.objects.bulk_update(to_update, ["is_suspicious"])

        self.stdout.write(self.style.SUCCESS(
            f"Processed {len(to_update)} postings; flags updated."
        ))
