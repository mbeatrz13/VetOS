from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from apps.accounts.models import User
from apps.reception.models import (
    Employee, Veterinarian, Receptionist, Specialty, Tutor, Animal, Appointment
)
from apps.clinic.models import MedicalRecord, Consultation
from apps.inventory.models import Product, StockMovement


class Command(BaseCommand):
    help = "Popula o banco de dados com dados iniciais para desenvolvimento"

    def handle(self, *args, **options):
        self.stdout.write("Iniciando seed de dados...")

        # 1. Criar especialidades
        self.stdout.write("  → Criando especialidades...")
        specialties = {}
        for name in ["Cirurgia", "Dermatologia", "Cardiologia", "Oftalmologia"]:
            specialty, created = Specialty.objects.get_or_create(name=name)
            specialties[name] = specialty

        # 2. Criar admin
        self.stdout.write("  → Criando usuário admin...")
        admin_user, _ = User.objects.get_or_create(
            username="admin",
            defaults={
                "role": User.Role.ADMIN,
                "state": User.State.ACTIVE,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if _:
            admin_user.set_password("admin123")
            admin_user.save()

        # 3. Criar veterinários
        self.stdout.write("  → Criando veterinários...")
        vets = []
        vet_names = [
            ("Dr. Carlos Silva", "123456/SP", ["Cirurgia", "Cardiologia"]),
            ("Dra. Ana Santos", "789012/RJ", ["Dermatologia", "Oftalmologia"]),
            ("Dr. Paulo Costa", "345678/MG", ["Cirurgia"]),
        ]

        for vet_name, crmv, spec_names in vet_names:
            # Criar User
            username = vet_name.lower().replace(" ", "_").replace(".", "")
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={"role": User.Role.VET, "state": User.State.ACTIVE},
            )
            if _:
                user.set_password("vet123")
                user.save()

            # Criar Employee
            employee, _ = Employee.objects.get_or_create(
                user=user,
                defaults={
                    "name": vet_name,
                    "email": f"{username}@vetos.com",
                    "phone": f"11-9999-{len(vets):04d}",
                    "status": Employee.Status.ACTIVE,
                },
            )

            # Criar Veterinarian
            vet, _ = Veterinarian.objects.get_or_create(
                employee=employee,
                defaults={"crmv": crmv},
            )

            # Adicionar especialidades
            for spec_name in spec_names:
                vet.specialties.add(specialties[spec_name])

            vets.append(vet)

        # 4. Criar recepcionistas
        self.stdout.write("  → Criando recepcionistas...")
        receptionists = []
        rec_names = ["Maria Silva", "João Santos", "Paula Costa"]

        for i, rec_name in enumerate(rec_names):
            username = f"rec_{i+1}"
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    "role": User.Role.RECEPTIONIST,
                    "state": User.State.ACTIVE,
                },
            )
            if _:
                user.set_password("rec123")
                user.save()

            employee, _ = Employee.objects.get_or_create(
                user=user,
                defaults={
                    "name": rec_name,
                    "email": f"{username}@vetos.com",
                    "phone": f"11-8888-{i+1:04d}",
                    "status": Employee.Status.ACTIVE,
                },
            )

            receptionist, _ = Receptionist.objects.get_or_create(employee=employee)
            receptionists.append(receptionist)

        # 5. Criar tutores e animais
        self.stdout.write("  → Criando tutores e animais...")
        tutor_data = [
            ("João Silva", "joao@email.com", "11-99999-0001"),
            ("Maria Santos", "maria@email.com", "11-99999-0002"),
            ("Pedro Costa", "pedro@email.com", "11-99999-0003"),
            ("Ana Oliveira", "ana@email.com", "11-99999-0004"),
            ("Carlos Mendes", "carlos@email.com", "11-99999-0005"),
        ]

        animals_data = [
            ("Bolinha", "Cachorro", "Poodle", "2020-01-15", 5.5),
            ("Miau", "Gato", "Persa", "2019-06-20", 4.2),
            ("Rex", "Cachorro", "Labrador", "2018-03-10", 30.0),
            ("Flor", "Gato", "Siamês", "2021-11-05", 3.8),
            ("Buddy", "Cachorro", "Golden Retriever", "2021-08-12", 28.5),
            ("Luna", "Gato", "Sphynx", "2022-02-14", 3.5),
            ("Thor", "Cachorro", "Bulldog", "2020-05-22", 25.0),
            ("Whiskers", "Gato", "Bengal", "2021-12-01", 5.0),
        ]

        tutors = []
        for tutor_name, email, phone in tutor_data:
            tutor, _ = Tutor.objects.get_or_create(
                name=tutor_name,
                defaults={"email": email, "phone": phone},
            )
            tutors.append(tutor)

        for i, animal_data in enumerate(animals_data):
            name, species, breed, dob, weight = animal_data
            tutor = tutors[i % len(tutors)]
            Animal.objects.get_or_create(
                tutor=tutor,
                name=name,
                defaults={
                    "species": species,
                    "breed": breed,
                    "date_of_birth": datetime.strptime(dob, "%Y-%m-%d").date(),
                    "weight": weight,
                    "active": True,
                },
            )

        # 6. Criar medical records
        self.stdout.write("  → Criando prontuários...")
        for animal in Animal.objects.all():
            MedicalRecord.objects.get_or_create(
                animal=animal,
                defaults={"general_notes": f"Prontuário de {animal.name}"},
            )

        # 7. Criar agendamentos
        self.stdout.write("  → Criando agendamentos...")
        base_date = timezone.now().date()
        for i, animal in enumerate(Animal.objects.all()[:5]):
            for day_offset in range(1, 4):
                appt_date = base_date + timedelta(days=day_offset)
                vet = vets[i % len(vets)]
                rec = receptionists[i % len(receptionists)]

                Appointment.objects.get_or_create(
                    animal=animal,
                    date=appt_date,
                    time="14:00",
                    defaults={
                        "veterinarian": vet,
                        "receptionist": rec,
                        "type": "consultation",
                        "status": "scheduled",
                        "notes": f"Consulta agendada para {animal.name}",
                    },
                )

        # 8. Criar produtos
        self.stdout.write("  → Criando produtos...")
        products_data = [
            ("Amoxicilina 250mg", "Medicamento", "Comprimido", 100, 20, 299.90),
            ("Dipirona 500mg", "Medicamento", "Comprimido", 200, 50, 149.90),
            ("Serum Fisiológico", "Solução", "Frasco", 30, 5, 45.00),
            ("Bandagem Elástica 5cm", "Material", "Rolo", 50, 10, 25.00),
            ("Gaze Estéril", "Material", "Pacote", 100, 20, 18.50),
            ("Algodão 500g", "Material", "Embalagem", 40, 10, 22.00),
        ]

        for name, category, unit, qty, min_stock, price in products_data:
            Product.objects.get_or_create(
                name=name,
                defaults={
                    "category": category,
                    "unit": unit,
                    "quantity": qty,
                    "minimum_stock": min_stock,
                    "unit_price": price,
                },
            )

        # 9. Criar movimentações de estoque
        self.stdout.write("  → Criando movimentações de estoque...")
        for i, product in enumerate(Product.objects.all()[:3]):
            employee = Employee.objects.first()
            StockMovement.objects.get_or_create(
                product=product,
                employee=employee,
                defaults={
                    "type": "in",
                    "quantity": 50,
                    "reason": "Compra inicial",
                },
            )

        self.stdout.write(
            self.style.SUCCESS("✓ Seed de dados concluído com sucesso!")
        )
        self.stdout.write("\nCredenciais para teste:")
        self.stdout.write("  Admin: admin / admin123")
        self.stdout.write("  Vet:   dr_carlos_silva / vet123")
        self.stdout.write("  Rec:   rec_1 / rec123")
