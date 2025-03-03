<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    use HasFactory;

    protected $table = 'pengumuman'; 
    protected $fillable = ['judul', 'isi', 'file', 'user_id']; 

    // ambil foregin key dari admin id
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}