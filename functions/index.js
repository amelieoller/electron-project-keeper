const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
firestore.settings({ timestampInSnapshots: true });

exports.deleteTag = functions.firestore
  .document('users/{userId}/tags/{tagId}')
  .onWrite(async (snapshot, context) => {
    if (!snapshot.after.exists) {
      // delete tag from projects
      const { userId, tagId } = context.params;

      const snapshot = await firestore.collection(`users/${userId}/projects`).get();
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      projects.map(async project => {
        const projectRef = firestore.doc(`users/${userId}/projects/${project.id}`);
        const snap = await projectRef.get('tags');
        const tags = snap.get('tags');
        const newTags = tags.filter(tag => tag.id !== tagId);

        return projectRef.update({ tags: newTags });
      });

      return null;
    }
    return null;
  });

exports.addTagsFromProject = functions.firestore
  .document('users/{userId}/projects/{projectId}')
  .onWrite(async (snapshot, context) => {
    if (!snapshot.after.exists) return;

    // Create and update
    const { userId } = context.params;
    let tagsToRemoveCounterFrom = [];
    let tagsToAddCountersTo = [];
    const snapBefore = snapshot.before.data();
    const snapAfter = snapshot.after.data();
    const tagsBefore = snapBefore ? snapBefore.tags : [];
    const tagsAfter = snapAfter ? snapAfter.tags : [];

    if (tagsBefore.length !== 0) {
      tagsToRemoveCounterFrom = tagsBefore.filter(
        tag => !tagsAfter.map(t => t.name).includes(tag.name)
      );

      tagsToRemoveCounterFrom.map(async tag => {
        const tagRef = firestore.doc(`users/${userId}/tags/${tag.id}`);
        const snap = await tagRef.get('count');
        const count = snap.get('count');

        tagRef.update({ count: count - 1 });
      });

      return null;
    }

    if (tagsAfter.length !== 0) {
      tagsToAddCountersTo = tagsAfter.filter(
        tag => !tagsBefore.map(t => t.name).includes(tag.name)
      );

      tagsToAddCountersTo.map(async tag => {
        const tagRef = firestore.doc(`users/${userId}/tags/${tag.id}`);
        const snap = await tagRef.get('count');
        const count = snap.get('count');

        tagRef.update({ count: count + 1 });
      });

      return null;
    }

    return null;
  });
