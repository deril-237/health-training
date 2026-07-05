## 📋 Guide MessagePopup - Améliorations et Utilisation

### ✨ Améliorations apportées

1. **Intégration Zustand** - Utilise maintenant le store global `useModalStore`
2. **Accessibilité (A11y)** - ARIA labels, focus management, keyboard support (Esc, Enter)
3. **Support clavier** - Fermeture avec Esc, confirmation avec Enter
4. **Gestion du focus** - Focus trap et restauration du focus précédent
5. **Animations** - Transitions fluides avec Tailwind (`animate-in`, `fade-in`, `zoom-in`)
6. **Typage strict** - Types générique pour les différents niveaux de sévérité
7. **Gestion asynchrone** - Support des callbacks async avec state de chargement
8. **Approche déclarative** - Plus besoin de `createRoot` imperatif

### 🎯 Architecture

```
MessagePopup.tsx          ← Composant principal avec logique
  ↓
MessagePopupModal.tsx     ← Wrapper pour l'intégration au ModalRoot
  ↓
ModalRoot.tsx            ← Conteneur centralisé des modales
  ↓
useModalStore.ts         ← Store Zustand pour la gestion d'état
```

### 📖 Exemples d'utilisation

#### 1. **Confirmation simple**

```typescript
import { useMessagePopup } from "@/components/molecules/MessagePopup";

export function MyComponent() {
  const { openConfirm } = useMessagePopup();

  const handleDelete = async () => {
    await openConfirm({
      type: "danger",
      title: "Supprimer?",
      message: "Cette action est irréversible.",
      showBtnCancel: true,
      onConfirm: async () => {
        // Votre logique ici
        await deleteItem();
      },
    });
  };

  return <button onClick={handleDelete}>Supprimer</button>;
}
```

#### 2. **Notification simple**

```typescript
await openConfirm({
  type: "success",
  title: "Succès!",
  message: "L'élément a été créé avec succès.",
});
```

#### 3. **Avec différents types**

```typescript
// Info
{ type: "info", title: "Information", message: "..." }

// Danger
{ type: "danger", title: "Attention!", message: "..." }

// Success
{ type: "success", title: "Succès!", message: "..." }

// Warning
{ type: "warning", title: "Avertissement", message: "..." }
```

#### 4. **Avec texte personnalisé**

```typescript
await openConfirm({
  type: "danger",
  title: "Confirmer la suppression",
  message: "Êtes-vous sûr?",
  confirmText: "Oui, supprimer",
  cancelText: "Non, annuler",
  showBtnCancel: true,
  onConfirm: () => {
    /* ... */
  },
  onCancel: () => {
    /* ... */
  },
});
```

### 🔧 Configuration

Le composant est automatiquement configuré dans [app/admin/layout.tsx](../../../app/admin/layout.tsx):

```typescript
const modalContent: ModalContentType = {
  program: ProgramForm,
  messagePopup: MessagePopupModal,  // ← Ajouté
};

<ModalRoot modalContentMap={modalContent} />
```

### ⚙️ État du store

```typescript
{
  modalType: "messagePopup";
  isOpen: true;
  isLoading: false;
  data: {
    type: "danger",
    title: "...",
    message: "...",
    // ...
  };
}
```

### 🎨 Styles personnalisés

Les couleurs par type:

- **info**: Bleu
- **danger**: Rouge
- **success**: Vert
- **warning**: Jaune

### 🖥️ Intégration avec React 19

✅ Utilise les derniers patterns React 19
✅ Pas d'effet de bord côté DOM
✅ Gestion complète du cycle de vie
✅ Type-safe avec TypeScript strict

### 🚀 Avantages par rapport à l'ancienne version

| Ancienne                | Nouvelle                     |
| ----------------------- | ---------------------------- |
| `createRoot` imperatif  | Déclaratif avec React hooks  |
| Pas d'accessibilité     | ARIA labels complètes        |
| Pas de keyboard support | Esc/Enter supportés          |
| Promise mal gérée       | Async/await avec chargement  |
| Type incomplet          | TypeScript strict            |
| Pas de nettoyage        | Focus management automatique |
| Pas d'état global       | Zustand intégré              |

### 🔍 Debugging

Pour voir l'état du store:

```typescript
import { useModalStore } from "@/store/useModalStore";

// Dans votre composant
const state = useModalStore();
console.log(state);
```

### 📝 Notes

- Le composant se ferme automatiquement après `onConfirm` ou `onCancel`
- Les callbacks sont optionnels
- Le loading state est géré automatiquement pendant les opérations async
- Les animations sont basées sur Tailwind `animate-in`
