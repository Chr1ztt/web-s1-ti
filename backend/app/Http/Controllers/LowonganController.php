<?php

namespace App\Http\Controllers;

use App\Models\Lowongan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LowonganController extends Controller
{
    // Get semua lowongan
    public function index()
    {
        return response()->json(Lowongan::with('user:id,name')->latest()->get());
    }

    // Buat lowongan (hanya admin)
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'file' => 'nullable|mimes:jpg,jpeg,png,pdf,mp4|max:20480', // File max 20MB
            'link_pendaftaran' => 'nullable|url', // Link harus URL valid
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('lowongan_files', 'public');
        }

        $lowongan = Lowongan::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'file' => $filePath,
            'link_pendaftaran' => $request->link_pendaftaran,
            'user_id' => auth()->id(), // ID admin yang upload
        ]);

        return response()->json(['message' => 'Lowongan berhasil dibuat!', 'lowongan' => $lowongan]);
    }

    // Get detail lowongan
    public function show($id)
    {
        $lowongan = Lowongan::with('user')->findOrFail($id);
        return response()->json($lowongan);
    }

    // Update lowongan (hanya admin)
    public function update(Request $request, $id)
    {
        $lowongan = Lowongan::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'file' => 'nullable|mimes:jpg,jpeg,png,pdf,mp4|max:20480',
            'link_pendaftaran' => 'nullable|url',
        ]);

        if ($request->hasFile('file')) {
            if ($lowongan->file) {
                Storage::disk('public')->delete($lowongan->file);
            }
            $lowongan->file = $request->file('file')->store('lowongan_files', 'public');
        }

        $lowongan->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'link_pendaftaran' => $request->link_pendaftaran,
        ]);

        return response()->json(['message' => 'Lowongan berhasil diperbarui!', 'lowongan' => $lowongan]);
    }

    // Hapus lowongan (hanya admin)
    public function destroy($id)
    {
        $lowongan = Lowongan::findOrFail($id);

        if ($lowongan->file) {
            Storage::disk('public')->delete($lowongan->file);
        }

        $lowongan->delete();

        return response()->json(['message' => 'Lowongan berhasil dihapus!']);
    }
}
