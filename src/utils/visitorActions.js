const DEFAULT_DECISION_NOTES = {
  Approved: 'Authorized for Flat 1204 entry',
  Rejected: 'Resident denied entry',
  'Leave at Gate': 'Please keep packages at Tower A lobby desk'
};

/**
 * Immediately records a visitor gate decision and displays a toast notification
 * without opening a confirmation popup.
 */
export function submitVisitorDecision({
  visitor,
  decision,
  currentUser,
  decideVisitor,
  addToast
}) {
  if (!visitor || !decision) return;
  const note = DEFAULT_DECISION_NOTES[decision] || '';
  const res = decideVisitor(visitor.id, decision, note, currentUser);

  addToast({
    title: res.success
      ? decision === 'Approved'
        ? 'Visitor Approved'
        : decision === 'Rejected'
        ? 'Visitor Rejected'
        : 'Decision Recorded'
      : 'Cannot Process Request',
    message: res.message,
    type: res.success ? (decision === 'Rejected' ? 'info' : 'success') : 'error'
  });
}

