#!/usr/bin/env python3
"""Generate Oria MVP Roadmap PDF"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

W, H = A4
OUT = "/home/talam/oria-mvp/tasks/Oria_Roadmap.pdf"

purple = HexColor("#7c3aed")
purple_light = HexColor("#ede9fe")
dark = HexColor("#0B0B11")
gray = HexColor("#64697A")
white = HexColor("#FFFFFF")
gold = HexColor("#F59E0B")
sport = HexColor("#FC4C02")
green = HexColor("#10B981")

styles = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=22, textColor=purple, spaceAfter=4, alignment=TA_CENTER),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=11, textColor=gray, spaceAfter=16, alignment=TA_CENTER),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=14, textColor=dark, spaceBefore=18, spaceAfter=8),
    "item_title": ParagraphStyle("item_title", fontName="Helvetica-Bold", fontSize=10, textColor=dark),
    "item_desc": ParagraphStyle("item_desc", fontName="Helvetica", fontSize=9, textColor=gray, leading=13),
    "footer": ParagraphStyle("footer", fontName="Helvetica", fontSize=8, textColor=gray, alignment=TA_CENTER),
}

sections = [
    ("UX / Features", purple, [
        ("1. Push Notifications (PWA)", "Service worker pour envoyer des push notifications reelles sur le telephone. Les notifs in-app ne sont vues que quand l'utilisateur ouvre l'app."),
        ("2. Onboarding Flow", "Guider le nouvel utilisateur etape par etape : connecter Strava, definir objectif km, ajouter des amis, premier depot."),
        ("3. Streak Recovery", "Permettre de 'sauver' un streak casse en depensant des tokens. Gamification forte, incite a deposer plus."),
        ("4. Challenges Actifs", "Le module backend existe. Creer le flow frontend : creer un challenge, inviter des amis, suivre la progression."),
        ("5. Weekly Recap", "Notification chaque dimanche soir avec resume : km parcourus, streak, comparaison avec la semaine precedente et les amis."),
    ]),
    ("Social", gold, [
        ("6. Profil Public d'un Ami", "Tap sur un ami pour voir son historique de streaks, stats detaillees, progression, et son classement."),
        ("7. Reactions sur le Feed", "Liker et commenter les events des amis dans le feed d'activite (goal met, streak milestone, etc)."),
        ("8. Classement Hebdomadaire", "Leaderboard de la semaine en cours base sur les km parcourus, en complement du leaderboard par streak."),
    ]),
    ("Data / Analytics", sport, [
        ("13. Graphique de Progression", "Courbe km/semaine sur les 8 dernieres semaines. Visualiser la tendance et la consistance."),
        ("14. Heatmap d'Activite", "Calendrier style GitHub montrant les jours de run sur les 3 derniers mois. Couleur = distance."),
        ("15. Evolution du Pace", "Graphique min/km au fil du temps. Montrer l'amelioration de la vitesse grace a la consistance."),
        ("16. Comparaison avec Amis", "Overlay sa courbe de progression avec celle d'un ami. Stimule la competition positive."),
    ]),
    ("Technique", green, [
        ("17. PWA Install Prompt", "Bouton 'Ajouter a l'ecran d'accueil' avec manifest.json et icones. Experience native."),
        ("18. Offline Mode", "Cache les donnees (streak, activites, amis) pour affichage hors-ligne via service worker."),
        ("19. Strava Webhook", "Sync automatique quand Strava recoit une activite au lieu de polling. Real-time."),
        ("20. Dark/Light Mode Toggle", "Le design system est dark-only. Ajouter un mode clair pour preference utilisateur."),
    ]),
]

def build():
    doc = SimpleDocTemplate(OUT, pagesize=A4, topMargin=25*mm, bottomMargin=20*mm, leftMargin=20*mm, rightMargin=20*mm)
    story = []

    story.append(Paragraph("ORIA — Roadmap MVP", styles["title"]))
    story.append(Paragraph("Ameliorations planifiees · Avril 2026", styles["subtitle"]))
    story.append(Spacer(1, 6))

    for section_title, color, items in sections:
        # Section header
        story.append(Paragraph(f'<font color="#{color.hexval()[2:]}">\u25CF</font>  {section_title}', styles["section"]))

        # Table of items
        data = []
        for title, desc in items:
            data.append([
                Paragraph(title, styles["item_title"]),
                Paragraph(desc, styles["item_desc"]),
            ])

        t = Table(data, colWidths=[55*mm, 105*mm], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LINEBELOW", (0, 0), (-1, -2), 0.4, HexColor("#E5E7EB")),
            ("LEFTPADDING", (0, 0), (0, -1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Note : la section Wallet/DeFi (withdraw, yield reel, QR code) est reportee a une phase ulterieure.", styles["footer"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Genere automatiquement · Oria MVP · stake.capital", styles["footer"]))

    doc.build(story)
    print(f"PDF saved to {OUT}")

if __name__ == "__main__":
    build()
