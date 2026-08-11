async function acceptInvite(invite: Invite) {
  setIsWorking(invite.id);

  const { error } = await supabase.rpc("accept_landlord_invite", {
    invite_id: invite.id,
  });

  if (error) {
    toast.error(error.message || "We couldn’t accept this invitation.");
    setIsWorking("");
    return;
  }

  toast.success("Lease connected to your landlord account.");
  await loadData(userId, email);
  setIsWorking("");
}