"use client";

export default function SquadPanel({ members }) {
  return (
    <section className="panel squad-panel">
      <div className="panel-header">
        <h2>Active squad</h2>
      </div>
      {members.length === 0 ? (
        <p className="muted-message">No accepted collaborators yet. Group event quests will show up here.</p>
      ) : (
        <div className="squad-list">
          {members.map((member) => (
            <article key={member.id} className="squad-card">
              <div className="squad-avatar">{(member.full_name || member.username || member.email).slice(0, 1).toUpperCase()}</div>
              <div>
                <strong>{member.full_name || member.username || member.email}</strong>
                <span>{member.username || member.email}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
